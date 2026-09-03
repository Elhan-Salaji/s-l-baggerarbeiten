# S.L. Baggerarbeiten — Webseite

Webseite für S.L. Baggerarbeiten, einen Ein-Mann-Betrieb für
Minibagger-Arbeiten im Ortenaukreis. Ein React-Frontend liefert den
One-Pager samt Impressum und Datenschutz, eine Serverless-Funktion
nimmt Kontaktanfragen entgegen und leitet sie per E-Mail weiter. Beides
läuft auf Vercel unter https://s-l-baggerarbeiten.de.

## Aufbau

| Bereich | Inhalt |
|---------|--------|
| `frontend/` | React mit Vite und TypeScript, Design und Inhalte des One-Pagers |
| `frontend/api/` | Serverless-Funktion für die Kontakt-API `POST /api/kontakt` |
| `backend/` | Spring Boot (Java 21, Maven), abgelöste Kontakt-API, siehe unten |
| `docker/` | Compose-Dateien, Caddyfile, Umgebungsvorlage des alten Betriebs |
| `docs/` | Architekturentscheidungen (`adr/`) und Server-Anleitung (`deployment.md`) |
| `assets/`, `tools/` | Quellfotos und das Skript zur Bildaufbereitung |

Warum das so geschnitten ist, steht in den ADRs unter `docs/adr/`,
angefangen bei `0001-trennung-in-frontend-und-backend.md`. Den Umzug
auf Vercel beschreibt `0006-betrieb-auf-vercel-statt-eigenem-server.md`.

`backend/` und `docker/` beschreiben den Betrieb bis Version 2.0.2 auf
einem eigenen Server. Sie werden nicht mehr deployt und bleiben nur so
lange liegen, bis die Domain auf Vercel zeigt und der Rollback auf den
alten Server nicht mehr gebraucht wird.

## Voraussetzungen

- Node 22 oder neuer
- Vercel CLI (`npm i -g vercel`) für die Kontakt-API im lokalen Lauf
- Java 21 und Docker nur noch, wenn du den abgelösten Serverbetrieb
  starten willst

## Lokale Entwicklung

Für Design und Inhalte reicht Vite allein:

```
cd frontend && npm install && npm run dev
```

Die Seite läuft dann auf http://localhost:5173. Das Kontaktformular
braucht die Serverless-Funktion, die kennt nur die Vercel CLI:

```
cd frontend && vercel dev
```

Dieser Weg bedient Seite und `POST /api/kontakt` zusammen auf
http://localhost:3000. Die SMTP-Zugangsdaten holt `vercel dev` aus dem
verknüpften Projekt, `vercel env pull` legt sie als `.env.local` ab.
Willst du beim Ausprobieren keine echten Mails verschicken, zeig
`SMTP_HOST` und `SMTP_PORT` auf ein lokales Mailpit
(`docker compose -f docker/compose.dev.yml up -d mailpit`, Postfach auf
http://localhost:8025).

## Tests

```
cd frontend && npm test && npm run build && npm run lint
```

Die Tests decken Validierung, Honeypot und Rate-Limiting der Kontakt-API
ab, dazu die Antworten des Endpunkts von 200 bis 503. `npm run build`
prüft nebenbei die Typen von Frontend und Funktion.

Die JUnit-Tests des abgelösten Backends laufen weiter mit
`cd backend && ./mvnw verify`.

## Abgelöster Serverbetrieb

```
cd docker && docker compose -f compose.dev.yml up -d --build
```

Bringt Caddy, Frontend, Spring-Backend und Mailpit zusammen hoch, wie
es bis Version 2.0.2 in Produktion lief, nur mit lokalem Zertifikat:
https://localhost:8443 (die Zertifikatswarnung ist hier normal). Für
die Arbeit an der Seite brauchst du das nicht mehr, es ist der
Rollback-Weg auf den eigenen Server.

## Konfiguration

Alle Zugangsdaten kommen aus Umgebungsvariablen. In Produktion stehen
sie im Vercel-Projekt unter Settings, Environment Variables; lokal legt
`vercel env pull` sie als `frontend/.env.local` ab. Ins Repository
gehören sie nicht.

| Variable | Zweck |
|----------|-------|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` | SMTP-Zugang für den Mailversand |
| `MAIL_FROM` | fester Absender, muss zum SMTP-Konto passen (SPF/DKIM) |
| `MAIL_RECIPIENT` | Empfänger der Anfragen, mehrere Adressen durch Komma getrennt |

`ACME_EMAIL` brauchte nur Caddy auf dem alten Server. Auf Vercel
kommen die Zertifikate vom Anbieter.

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

Das Formular sendet an `POST /api/kontakt`, umgesetzt in
`frontend/api/kontakt.ts`. Die Funktion validiert die Felder, verwirft
Anfragen mit gefülltem Honeypot-Feld still und erlaubt 5 Anfragen je
Stunde und Absender-Adresse. Gültige Anfragen gehen als E-Mail an alle
Adressen in `MAIL_RECIPIENT`, die Adresse aus dem Formular steht im
Reply-To.
Fehler kommen als ProblemDetail nach RFC 9457 zurück, mit einer
deutschen Meldung je Feld.

Das Rate-Limiting zählt im Speicher der Instanz. Vercel startet unter
Last mehrere Instanzen nebeneinander, die getrennt zählen; der Schutz
ist damit schwächer als auf dem alten Server (ADR 0006).

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

Impressum und Datenschutzerklärung tragen die echten Angaben des
Betreibers und sind im Footer verlinkt. Offen ist in der
Datenschutzerklärung noch die Speicherdauer der Server-Logfiles, sie
steht dort als Platzhalter in `[eckigen Klammern]`.

Der Umzug betrifft den Text: Abschnitt 2 nennt den Hoster, Abschnitt 4
den Anbieter für den Mailversand. Beides gehört nach der
DNS-Umstellung geprüft.

## Deployment

Vercel baut bei jedem Push auf `main` und veröffentlicht das Ergebnis,
Branches bekommen eine Preview-URL. Einrichtung, Umgebungsvariablen und
DNS-Umstellung stehen in [docs/deployment.md](docs/deployment.md).

## Versionen

Änderungen stehen im [CHANGELOG.md](CHANGELOG.md), Releases tragen
SemVer-Tags (`v2.0.0`).
