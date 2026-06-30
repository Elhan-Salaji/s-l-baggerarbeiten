# Changelog

Alle nennenswerten Änderungen an diesem Projekt stehen in dieser Datei.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
die Versionierung an [Semantic Versioning](https://semver.org/lang/de/).

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
