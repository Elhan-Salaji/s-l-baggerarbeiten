# ADR 0001: Trennung in Frontend und Backend

## Status

Akzeptiert

## Kontext

Die Webseite lief bis Version 1.0.0 als statisches HTML ohne Build-Schritt. Das Kontaktformular brauchte dafür einen externen Formular-Dienst, denn ohne eigenen Server kann die Seite keine E-Mails versenden. Der Betrieb soll ohne Drittanbieter auskommen, und die Seite soll unter https://s-l-baggerarbeiten.de mit eigenem Server laufen.

## Entscheidung

Das Repository wird ein Monorepo mit drei Bereichen:

- `frontend/` enthält die Webseite als React-Anwendung (Vite). Sie liefert alle Inhalte aus und läuft im eigenen Container.
- `backend/` enthält eine Spring-Boot-Anwendung mit genau einer Aufgabe: Sie nimmt Kontaktanfragen als REST-Aufruf entgegen, prüft sie und leitet sie per E-Mail weiter. Eine Datenbank braucht sie dafür nicht.
- `docker/` enthält die Deployment-Konfiguration. Je ein Container für Frontend und Backend, davor ein Reverse Proxy.

Die Quellfotos unter `assets/img/original` und `assets/logo/original` sowie das Bildskript `tools/optimize-images.py` bleiben im Wurzelverzeichnis. Sie gehören zur Bildpflege, nicht zum Web-Build.

Sprachkonvention: Bezeichner im Code sind englisch, öffentliche URIs, Dokumentation und Commit-Nachrichten deutsch. Die Zielgruppe der Seite und der Betreiber sprechen deutsch, der Code folgt den Konventionen der Frameworks.

## Konsequenzen

- Frontend und Backend lassen sich getrennt entwickeln, testen und deployen.
- Das Kontaktformular kommt ohne Formular-Dienst aus, Anfragen bleiben zwischen Besucher und Betreiber.
- Der Betrieb braucht einen eigenen Server mit Docker statt eines simplen Webspace. Diesen Preis zahlen wir für den Wegfall des Drittanbieters.
- Zwei Toolchains (Node und Maven) statt keiner. Der Maven Wrapper und `npm ci` halten die Einstiegshürde klein.
