# Changelog

Alle nennenswerten Änderungen an diesem Projekt stehen in dieser Datei.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
die Versionierung an [Semantic Versioning](https://semver.org/lang/de/).

## [3.4.0] - 2026-09-04

### Changed
- Die Galerie liegt ab zwei Spalten in einem Zeilenraster statt im Mehrspaltenlayout. Wie viele Rasterzeilen eine Kachel belegt, leitet `Gallery.tsx` aus dem Seitenverhältnis ab, die Zeilenhöhe wächst mit der Spaltenbreite mit. Die Spalten endeten vorher bis zu 512 Pixel auseinander und liefen treppenförmig aus; jetzt sind es 87 Pixel bei drei Spalten und keine Abweichung bei zweien.
- Reihenfolge der Galeriebilder so gewählt, dass sich die Spalten gleichmäßig füllen. Inhaltlich ändert sich nichts, nur zwei Paare tauschen die Position.

## [3.3.0] - 2026-09-04

### Added
- `robots.txt` und `sitemap.xml` mit den drei Seiten der Anwendung.
- Open Graph um `og:url`, `og:site_name`, Bildmaße, Bildbeschreibung und die Twitter-Card ergänzt.

### Fixed
- `og:image` und das Bild in den LocalBusiness-Daten standen als relativer Pfad. WhatsApp, Facebook und LinkedIn zeigten deshalb keine Vorschau, wenn jemand die Seite teilt. Beide Adressen sind jetzt absolut.

## [3.2.1] - 2026-09-04

### Changed
- Die Datenschutzerklärung nennt jetzt die vollständige Anschrift des Hosting-Anbieters, die Standardvertragsklauseln als Grundlage der Übermittlung in die USA und die Speicherdauer der Server-Logfiles. Damit enthält die Seite keine Platzhalter mehr.

## [3.2.0] - 2026-09-04

### Changed
- Hero-Kachel heißt „Demontage Baggerdach" statt „Dach ab".
- Der zweite Absatz im Abschnitt „Über mich" steht in der normalen Textfarbe der Seite statt in Grau.
- Leistungen überarbeitet: „Fundamentaushub" beschreibt jetzt die Herstellung kleinerer Baugruben, „Erdbewegungen und Garten" die Erdarbeiten rund um den Garten. „Gräben und Versickerung" heißt „Gräben" und nennt Strom, Wasser und Leerrohre, „Pflaster vorbereiten" heißt „Untergrund verdichten" und nennt Platte und Plattenrüttler.

### Removed
- Die Leistungen „Leitungsarbeiten" und „Böschungen anlegen" entfallen.

## [3.1.0] - 2026-09-04

### Added
- Zweite Kontaktadresse `s.l.baggerarbeiten@web.de`: Sie steht in der Kontakt-Sektion, im Footer, im Impressum, in der Datenschutzerklärung und in den LocalBusiness-Daten neben `info@s-l-baggerarbeiten.de`.
- `MAIL_RECIPIENT` nimmt mehrere durch Komma getrennte Adressen an. Jede Anfrage aus dem Kontaktformular geht damit an beide Postfächer.

### Changed
- Absender und Empfänger der Kontaktmails stehen als Vorgabe im Code. Für den Betrieb reichen damit die vier SMTP-Variablen; `MAIL_FROM` und `MAIL_RECIPIENT` überschreiben die Vorgabe nur noch bei Bedarf.

### Fixed
- Die Kontakt-API stürzte auf Vercel beim Start mit `FUNCTION_INVOCATION_FAILED` ab. Die übersetzte Funktion läuft als ESM, dort brauchen relative Importe eine Dateiendung.

### Security
- Alle `.env`-Dateien sind von der Versionierung ausgeschlossen, nicht mehr nur `docker/.env`. Eine `.env` unter `frontend/` hätte sonst den SMTP-Zugang offengelegt.

## [3.0.0] - 2026-09-04

### Added
- Kontakt-API als Vercel-Serverless-Funktion (`frontend/api/kontakt.ts`): Validierung mit denselben deutschen Feldmeldungen, Honeypot, Rate-Limiting von 5 Anfragen je Stunde und Absender, Mailversand per SMTP mit Reply-To auf die Absenderadresse, Fehler als ProblemDetail nach RFC 9457.
- `frontend/vercel.json` mit Security-Headern, Cache-Regeln und dem Fallback auf `index.html` für die Routen `/impressum` und `/datenschutz`.
- Tests mit Vitest für Validierung, Honeypot, Rate-Limiting und die Antworten des Endpunkts (`npm test`).
- ADR 0006 zum Umzug auf Vercel.

### Changed
- Die Seite läuft auf Vercel statt auf einem eigenen Server. Der Build entsteht bei jedem Push auf `main`, Branches bekommen eine Preview-URL.
- Die Datenschutzerklärung nennt Vercel als Hoster.
- ADR 0005 (Docker Compose und Caddy) ist abgelöst.

### Fixed
- Impressum und Datenschutzerklärung standen im Quellcode noch als Vorlage mit Platzhaltern, während die veröffentlichte Fassung seit Juli die echten Angaben trug. Ein Build aus dem Quellstand hätte Anschrift, Verantwortlichen und den Namen des Mailanbieters wieder durch Platzhalter ersetzt.

### Deprecated
- `backend/` und `docker/` beschreiben den abgelösten Serverbetrieb. Sie bleiben liegen, bis die Domain auf Vercel zeigt und der Rollback nicht mehr gebraucht wird.

## [2.0.2] - 2026-07-11

### Fixed
- Container-Healthchecks scheiterten auf dem Server: busybox-wget prüfte localhost über IPv6, nginx lauschte nur auf IPv4 (jetzt beides), die Checks prüfen 127.0.0.1. Der Mail-Health-Indicator ist abgeschaltet, damit ein gestörter SMTP-Anbieter den Backend-Container nicht unhealthy macht.

## [2.0.1] - 2026-07-11

### Changed
- Kontaktadresse überall auf info@s-l-baggerarbeiten.de umgestellt (Kontakt-Sektion, Footer, Impressum, Datenschutz, LocalBusiness-Daten, Umgebungsvorlage). Das web.de-Postfach entfällt.

## [2.0.0] - 2026-07-11

### Added
- Backend mit Kontakt-API `POST /api/kontakt` (Spring Boot, Java 21): Validierung mit deutschen Feldmeldungen, Mailversand per SMTP mit Reply-To auf die Absenderadresse, Honeypot und Rate-Limiting (5 Anfragen je Stunde und Absender), Health-Endpoint für Container-Checks.
- Docker-Deployment: je ein Container für Frontend und Backend (Multi-Stage-Builds, ohne Root-Rechte), davor Caddy mit automatischen Let's-Encrypt-Zertifikaten, Security-Headern und www-Umleitung für s-l-baggerarbeiten.de.
- Dev-Umgebung mit Mailpit und lokalem HTTPS (`docker/compose.dev.yml`), Server-Anleitung in `docs/deployment.md`.
- Architekturentscheidungen als ADRs in `docs/adr/` (Projektschnitt, Frontend-Stack, Backend ohne Datenbank, Spamschutz, Deployment).
- Rückmeldungen im Kontaktformular: Sende-Zustand, Erfolgsmeldung, Feldmeldungen der API, verständliche Fehlertexte mit Telefonnummer als Ausweg.

### Changed
- Frontend von statischem HTML auf React mit Vite und TypeScript umgestellt. Design, Inhalte und Verhalten (mobiles Menü, Lightbox, Scroll-Spy, Anker-Fokus) bleiben unverändert, Impressum und Datenschutz sind eigene Routen.
- Das Kontaktformular sendet an die eigene API statt an einen externen Formular-Dienst; die Datenschutzerklärung beschreibt den neuen Versandweg.
- Web-Bilder, Logos und Schriften liegen jetzt unter `frontend/public/`, das Bildskript schreibt dorthin.

### Removed
- Statische Dateien `index.html`, `impressum.html`, `datenschutz.html` und `js/main.js` (vollständig ins Frontend migriert).
- Formspree-Anbindung samt verstecktem `_gotcha`-Feld; den Spamschutz übernimmt das Backend.

## [1.0.0] - 2026-06-30

### Added
- One-Pager mit den Abschnitten Start, Über mich, Leistungen, Referenzen und Kontakt, verbunden über eine Anker-Navigation.
- Hero mit Bild, Claim und den drei Alleinstellungsmerkmalen: 1,2 Tonnen, 90 cm Durchfahrtsbreite, abnehmbares Dach.
- Leistungsübersicht mit zehn Einträgen und Galerie mit acht Fotos.
- Galerie-Lightbox, bedienbar mit Maus und Tastatur (Escape schließt, Pfeiltasten blättern).
- Mobiles Menü als Hamburger, aktiver Navigationspunkt beim Scrollen, sanftes Scrollen zu den Ankern.
- Kontaktformular mit Pflicht-Datenschutz-Checkbox und verstecktem Honeypot, dazu klickbare Telefon- und E-Mail-Angabe.
- Impressum und Datenschutzerklärung als Vorlagen mit klar markierten Platzhaltern.
- Lokal gehostete Schriften Inter und Archivo, kein externes Font-CDN.
- Web-optimierte Bilder als WebP mit JPEG- bzw. PNG-Fallback, ohne EXIF-Daten, dazu das Skript `tools/optimize-images.py`.
- Responsives, barrierearmes Layout mit Tastaturbedienung, sichtbarem Fokus und Rücksicht auf `prefers-reduced-motion`.
