# S.L. Baggerarbeiten — Webseite

Webseite für S.L. Baggerarbeiten, einen Ein-Mann-Betrieb für
Minibagger-Arbeiten im Ortenaukreis. Ein React-Frontend liefert den
One-Pager samt Impressum und Datenschutz, ein Spring-Boot-Backend
nimmt Kontaktanfragen entgegen und leitet sie per E-Mail weiter. Beide
laufen als Container hinter Caddy unter https://s-l-baggerarbeiten.de.

## Aufbau

| Bereich | Inhalt |
|---------|--------|
| `frontend/` | React mit Vite und TypeScript, Design und Inhalte des One-Pagers |
| `backend/` | Spring Boot (Java 21, Maven), Kontakt-API `POST /api/kontakt` |
| `docker/` | Compose-Dateien, Caddyfile, Umgebungsvorlage `.env.example` |
| `docs/` | Architekturentscheidungen (`adr/`) und Server-Anleitung (`deployment.md`) |
| `assets/`, `tools/` | Quellfotos und das Skript zur Bildaufbereitung |

Warum das so geschnitten ist, steht in den ADRs unter `docs/adr/`,
angefangen bei `0001-trennung-in-frontend-und-backend.md`.

## Voraussetzungen

- Java 21 (Maven bringt der Wrapper `./mvnw` selbst mit)
- Node 22 oder neuer
- Docker mit Compose-Plugin

## Lokale Entwicklung

Mailpit fängt die Mails auf, Backend und Frontend laufen direkt auf
dem Rechner:

```
cd docker   && docker compose -f compose.dev.yml up -d mailpit
cd backend  && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
cd frontend && npm install && npm run dev
```

Danach: Seite auf http://localhost:5173, verschickte Mails auf
http://localhost:8025. Der Vite-Proxy reicht `/api` an das Backend auf
Port 8080 weiter.

Sind Ports auf dem Rechner belegt, lassen sich alle verschieben:
`SERVER_PORT` für das Backend, `VITE_API_PROXY` für den Proxy,
`MAILPIT_SMTP_PORT`/`MAILPIT_UI_PORT`/`DEV_HTTPS_PORT` für die
Container (dann auch `SMTP_PORT` fürs Backend setzen).

## Tests

```
cd backend  && ./mvnw verify
cd frontend && npm run build && npm run lint
```

Die Backend-Tests decken Validierung, Mailversand, Honeypot und
Rate-Limiting ab. Sie laufen auch im Docker-Build des Backends, ein
kaputter Stand baut kein Image.

## Kompletter Stack lokal

```
cd docker && docker compose -f compose.dev.yml up -d --build
```

Bringt Caddy, Frontend, Backend und Mailpit zusammen hoch, wie in
Produktion, nur mit lokalem Zertifikat: https://localhost:8443 (die
Zertifikatswarnung ist hier normal).

## Konfiguration

Alle Zugangsdaten kommen aus Umgebungsvariablen. In Produktion liest
Compose sie aus `docker/.env` (Vorlage: `docker/.env.example`, die
echte Datei bleibt auf dem Server).

| Variable | Zweck |
|----------|-------|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` | SMTP-Zugang für den Mailversand |
| `MAIL_FROM` | fester Absender, muss zum SMTP-Konto passen (SPF/DKIM) |
| `MAIL_RECIPIENT` | Postfach des Betreibers, Empfänger der Anfragen |
| `ACME_EMAIL` | Let's-Encrypt-Konto für Zertifikats-Hinweise |

## Inhalte ändern

| Was | Wo |
|-----|-----|
| Texte der Abschnitte | `frontend/src/sections/`, je Abschnitt eine Datei |
| Leistungen | Liste `SERVICES` in `frontend/src/sections/Services.tsx` |
| Galerie: Bilder, Reihenfolge, Bildunterschriften | Liste `IMAGES` in `frontend/src/sections/Gallery.tsx` |
| Telefon und E-Mail | `Contact.tsx`, `Footer.tsx` sowie die Seiten unter `frontend/src/pages/` |
| Farben, Abstände, Schriftgrößen | `frontend/src/styles/tokens.css` |
| Impressum und Datenschutz | `frontend/src/pages/ImpressumPage.tsx` und `DatenschutzPage.tsx` |

Die Farben stammen aus dem Logo und liegen als Custom-Properties in
`tokens.css`. Rot bleibt bewusst sparsam gesetzt, für Buttons, aktive
Navigation und Akzente.

## Kontaktformular

Das Formular sendet an `POST /api/kontakt`. Das Backend validiert die
Felder, verwirft Anfragen mit gefülltem Honeypot-Feld still und
erlaubt 5 Anfragen je Stunde und Absender-Adresse. Gültige Anfragen
gehen als E-Mail an `MAIL_RECIPIENT`, die Adresse aus dem Formular
steht im Reply-To. Die Swagger-UI der API läuft im Dev-Profil auf
http://localhost:8080/swagger-ui/index.html.

## Bilder neu erzeugen

Die web-optimierten Bilder liegen fertig in `frontend/public/`. Neu
erzeugen muss man sie nur, wenn neue Fotos hinzukommen. Die Quellfotos
liegen in `assets/img/original/`.

```
python3 -m pip install Pillow
python3 tools/optimize-images.py
```

Für ein neues Galeriebild: Datei in `assets/img/original/` ablegen, in
`tools/optimize-images.py` in der Liste `GALLERY` ergänzen, das Skript
laufen lassen und den Eintrag in `frontend/src/sections/Gallery.tsx`
hinzufügen.

## Recht

Impressum und Datenschutzerklärung sind Vorlagen mit Platzhaltern in
`[eckigen Klammern]`. Vor dem Live-Gang die echten Daten eintragen und
beide Seiten rechtlich prüfen lassen. Beide sind im Footer verlinkt.

## Deployment

Server einrichten, DNS setzen, `docker compose up -d --build`: die
komplette Anleitung steht in [docs/deployment.md](docs/deployment.md).

## Versionen

Änderungen stehen im [CHANGELOG.md](CHANGELOG.md), Releases tragen
SemVer-Tags (`v2.0.0`).
