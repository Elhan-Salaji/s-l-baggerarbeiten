# Changelog

Alle nennenswerten Änderungen an diesem Projekt stehen in dieser Datei.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
die Versionierung an [Semantic Versioning](https://semver.org/lang/de/).

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
