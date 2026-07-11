# ADR 0002: Frontend mit Vite, React und TypeScript

## Status

Akzeptiert

## Kontext

Die statische Seite bestand aus drei HTML-Dateien, einem Stylesheet mit Design-Tokens und rund 250 Zeilen Vanilla-JavaScript für Menü, Lightbox, Scroll-Spy und Honeypot. Für den Umbau auf eine eigene Kontakt-API braucht das Formular Zustände (senden, Erfolg, Fehlerfälle), und die Seite soll als eigener Container hinter einem Reverse Proxy laufen.

## Entscheidung

Das Frontend wird eine React-Anwendung mit Vite und TypeScript.

- **React mit Vite**: Der Vite-Dev-Server mit Proxy erlaubt die lokale Entwicklung gegen das Backend ohne CORS-Konfiguration. Der Produktions-Build ist statisch und wird von nginx ausgeliefert.
- **TypeScript**: Die Vorlage `react-ts` kostet keinen Mehraufwand, und die Formular-Daten bekommen denselben Typ wie das Backend-DTO. Tippfehler in Props und Zuständen scheitern beim Build statt im Browser.
- **React Router** übernimmt die drei Routen `/`, `/impressum` und `/datenschutz`. Vor- und Zurück-Navigation und das Neuladen einer Route funktionieren damit ohne Eigenbau.
- **CSS bleibt CSS**: Das Stylesheet der statischen Seite wandert unverändert nach `src/styles/`, aufgeteilt in `tokens.css` (Schriften, Custom-Properties) und `global.css` (Layout, Bausteine). Die Klassennamen bleiben erhalten, die Seite sieht nach der Migration identisch aus. Ein CSS-Framework wäre ein Redesign, kein Umzug.
- Die Verhaltensbausteine des alten JavaScripts leben als React-Bausteine weiter: das mobile Menü als Zustand im Header, die Lightbox als eigene Komponente mit Fokus-Falle, der Scroll-Spy als Hook mit IntersectionObserver.

## Konsequenzen

- Das Kontaktformular kann Sende-Zustände und Fehlermeldungen anzeigen, sobald die API angebunden ist.
- Inhalte pflegen heißt jetzt: Listen in `src/sections/` bearbeiten statt HTML-Blöcke kopieren. Die Stellen sind kommentiert.
- Der Build-Schritt (`npm run build`) ist neu. Ohne ihn keine ausgelieferte Seite.
- Suchmaschinen erhalten weiter eine Seite mit vollständigen Metadaten in `index.html`. Die Inhalte rendert der Browser, für einen regionalen Handwerksbetrieb mit einer Marketing-Seite reicht das.
