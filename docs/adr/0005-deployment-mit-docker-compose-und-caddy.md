# ADR 0005: Deployment mit Docker Compose und Caddy

## Status

Akzeptiert

## Kontext

Die Seite soll unter https://s-l-baggerarbeiten.de auf einem eigenen
Server laufen (ADR 0001). Der Betrieb muss für eine Person ohne
Ops-Hintergrund beherrschbar bleiben: nachvollziehbare Updates,
automatische Zertifikate, wenig bewegliche Teile.

## Entscheidung

- **Zwei Anwendungs-Container** aus Multi-Stage-Builds: Frontend
  (nginx ohne Root-Rechte liefert den Vite-Build) und Backend
  (schlankes JRE, eigener Benutzer). Die Build-Stufen bauen im
  Container, der Server braucht weder Node noch Maven. Die
  Backend-Tests laufen im Image-Build mit und sind ohne CI das
  Qualitäts-Gate.
- **Caddy als Reverse Proxy** und einziger von außen erreichbarer
  Dienst (80/443). Caddy besorgt und erneuert die
  Let's-Encrypt-Zertifikate selbst, leitet www auf die Hauptdomain um,
  setzt die Security-Header und reicht nur `/api/*` an das Backend
  weiter. Frontend und Backend leben ohne veröffentlichte Ports im
  internen Container-Netz.
- **Build auf dem Server**: `git clone`, `.env` ausfüllen,
  `docker compose up -d --build`. Update per `git pull` und erneutem
  `up -d --build`. Eine Registry und eine CI-Pipeline kommen erst,
  wenn mehrere Umgebungen oder Mitwirkende sie rechtfertigen.
- **Zustand in Volumes**: Nur Caddy hält Daten (Zertifikate in
  `caddy_data`), die Anwendungs-Container sind wegwerfbar.
- **Zugangsdaten** (SMTP, ACME-E-Mail) liegen in `docker/.env` auf dem
  Server. Die Datei ist gitignored, das Repository enthält nur die
  Vorlage `.env.example`.

Verworfene Alternativen:

- **nginx mit certbot**: Zertifikatsausstellung, Erneuerungs-Cron und
  Volume-Verdrahtung sind Handarbeit; genau die Fehlerquelle, die
  Caddy wegnimmt.
- **Traefik**: stark bei vielen dynamischen Diensten, für eine Domain
  mit zwei Containern mehr Konfiguration als Nutzen.
- **Registry + CI-Deploy**: reproduzierbarer, aber zusätzliche
  Infrastruktur mit Zugangsdaten-Pflege. Bewusst vertagt, der Weg
  bleibt offen (ADR wird dann ersetzt).

## Konsequenzen

- Ein Server-Umzug besteht aus DNS-Umstellung, Clone und `up -d --build`.
- Der Server braucht Build-Ressourcen (Maven und npm laufen dort);
  auf kleinen Maschinen dauert das erste `--build` einige Minuten.
- Ohne CI merkt man kaputte Builds erst beim Deployment, dafür
  scheitert dann das neue Image und der laufende Container bleibt
  unangetastet stehen.
- Die lokale Verprobung (`compose.dev.yml`) nutzt dieselben Images
  und Caddy-Regeln mit lokalem Zertifikat, Abweichungen zwischen
  Entwicklung und Produktion bleiben klein.
