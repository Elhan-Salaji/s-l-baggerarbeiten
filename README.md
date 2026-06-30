# S.L. Baggerarbeiten — Webseite

Einseitige Webseite (One-Pager) für S.L. Baggerarbeiten, einen Ein-Mann-Betrieb für Minibagger-Arbeiten im Ortenaukreis.

## Überblick

Die Marketing-Seite läuft als ein durchscrollbares Dokument mit Anker-Navigation: Start, Über mich, Leistungen, Referenzen, Kontakt. Dazu kommen zwei rechtlich nötige Mini-Seiten, `impressum.html` und `datenschutz.html`.

## Technik und warum

Statisches HTML5, CSS und etwas Vanilla-JavaScript. Kein Framework, kein Build-Schritt, kein npm.

Eine Person pflegt die Seite. Statisch läuft sie überall gleich, lässt sich per FTP oder Drag-and-drop hochladen und hat keine Abhängigkeiten, die mit der Zeit veralten. Genau dafür ist dieser Aufbau gedacht.

JavaScript übernimmt nur das mobile Menü, die Galerie-Lightbox, den aktiven Navigationspunkt beim Scrollen, den Fokus nach einem Sprung zu einem Anker und den Honeypot im Formular. Ohne JavaScript bleibt die Seite lesbar und über Formular, Telefon und E-Mail erreichbar.

## Lokale Vorschau

Im Projektordner einen kleinen Webserver starten:

```
python3 -m http.server 8000
```

Danach `http://localhost:8000` im Browser öffnen. Der Server ist nur für die Vorschau nötig, damit Schriften und Pfade so laden wie später online.

## Veröffentlichen

Alle Dateien auf den Webspace laden, per FTP oder per Drag-and-drop im Hosting-Panel. Online müssen:

```
index.html  impressum.html  datenschutz.html
favicon.ico  apple-touch-icon.png
css/  js/
assets/fonts/  assets/img/  assets/logo/
```

Nicht online müssen `assets/img/original/` (die großen Quellfotos) und `tools/`. Beide brauchen nur die Bildbearbeitung, nicht die fertige Seite.

## Inhalte ändern

| Was | Wo |
|-----|-----|
| Texte der Abschnitte | `index.html`, jeweils im passenden `<section>`-Block |
| Leistungen | `index.html`, Liste `services__grid` (ein `<li class="service">` pro Eintrag) |
| Galerie: Bilder, Reihenfolge, Bildunterschriften | `index.html`, Liste `gallery__grid` (ein `<li class="gallery__cell">` pro Foto) |
| Telefon und E-Mail | `index.html` (Kontakt und Footer) sowie `impressum.html` und `datenschutz.html` |
| Farben, Abstände, Schriftgrößen | `css/styles.css`, Block `:root` (Custom-Properties an einer Stelle) |
| Verhalten (Menü, Lightbox, Navigation) | `js/main.js` |

Die Farben stammen aus dem Logo und liegen als Custom-Properties gebündelt in `:root`. Rot ist bewusst sparsam gesetzt, für Buttons, aktive Navigation und Akzente. Für langen Fließtext reicht der Kontrast von Rot auf Hell nicht, deshalb steht dort Anthrazit.

## Kontaktformular

Das Formular kommt ohne eigenes Backend aus. Es gibt zwei Wege:

1. **Formular-Dienst (empfohlen).** Bei [formspree.io](https://formspree.io) ein Formular anlegen und die Form-ID kopieren. In `index.html` im `<form>` das `action`-Attribut von `https://formspree.io/f/DEINE-FORM-ID` auf die echte Adresse setzen. Zugangsdaten oder Schlüssel gehören nicht in den Code.
2. **Ohne Dienst (`mailto`-Fallback).** Im `<form>` `action="mailto:s.l.baggerarbeiten@web.de"` und `method="post" enctype="text/plain"` setzen. Beim Absenden öffnet sich das Mailprogramm des Besuchers. Das ist weniger komfortabel, kommt aber ohne Dritte aus.

Unabhängig vom gewählten Weg stehen Telefon und E-Mail sichtbar und klickbar auf der Seite. Das versteckte Honeypot-Feld (`_gotcha`) fängt automatisierten Spam ab; Formspree wertet es zusätzlich serverseitig aus.

## Schriften

Inter (Fließtext) und Archivo (Überschriften) liegen lokal als `woff2` in `assets/fonts/`. Es gibt keine Verbindung zu einem Google-Fonts-CDN, das ist auch aus Datenschutzsicht so gewollt. Die Schriften stehen unter der SIL Open Font License, der Lizenztext liegt in `assets/fonts/OFL-Inter.txt` und `assets/fonts/OFL-Archivo.txt`.

## Bilder neu erzeugen

Die web-optimierten Bilder liegen fertig in `assets/img/` und `assets/logo/`. Neu erzeugen muss man sie nur, wenn neue Fotos hinzukommen. Die Quellfotos liegen in `assets/img/original/`.

```
python3 -m pip install Pillow
python3 tools/optimize-images.py
```

Das Skript skaliert die Bilder, schreibt WebP plus JPEG- bzw. PNG-Fallback, entfernt die EXIF-Daten und legt die Größen für Hero, Galerie, Lightbox, Logo und Favicon an. Für ein neues Galeriebild: Datei in `assets/img/original/` ablegen, in `tools/optimize-images.py` in der Liste `GALLERY` ergänzen, das Skript laufen lassen und in `index.html` einen Galerie-Eintrag hinzufügen.

## Recht

`impressum.html` und `datenschutz.html` sind Vorlagen mit Platzhaltern in `[eckigen Klammern]`. Vor dem Live-Gang die echten Daten eintragen (Name, Anschrift, Verantwortlicher, ggf. USt-IdNr., Hosting-Anbieter) und beide Seiten rechtlich prüfen lassen. Ein Impressum (§ 5 DDG) und eine Datenschutzerklärung (DSGVO) sind in Deutschland Pflicht und müssen leicht auffindbar sein; beide sind im Footer verlinkt.

## Vor dem Live-Gang

- Impressum und Datenschutz ausgefüllt und geprüft
- Formular-Ziel gesetzt: Formspree-ID oder `mailto`
- Telefon und E-Mail geprüft
- `og:image` und Domain in `index.html` an die echte Adresse angepasst (optional, für die Vorschau beim Teilen)

## Projektstruktur

```
index.html              One-Pager mit allen Inhaltsabschnitten
impressum.html          Pflichtangaben (Vorlage mit Platzhaltern)
datenschutz.html        Datenschutzerklärung (Vorlage mit Platzhaltern)
favicon.ico             Browser-Icon
apple-touch-icon.png    Icon für mobile Lesezeichen
css/styles.css          gesamtes Layout und Design, Tokens in :root
js/main.js              Menü, Lightbox, Navigation, Honeypot
assets/
  fonts/                lokal gehostete Schriften (woff2) plus Lizenzen
  img/                  web-optimierte Bilder (WebP plus Fallback)
  img/original/         Quellfotos, nur für die Bildbearbeitung
  logo/                 Logo-Emblem hell und dunkel
  logo/original/        Quell-Logos
tools/optimize-images.py  erzeugt die web-optimierten Bilder
CHANGELOG.md            Änderungen je Version
```
