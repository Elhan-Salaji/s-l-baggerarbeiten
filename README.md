# S.L. Baggerarbeiten

Website von S.L. Baggerarbeiten, Minibagger-Arbeiten im Ortenaukreis. Die Seite ist eine React-Anwendung, die als statischer Build ausgeliefert wird. Dieses Repo bereitet sie für das Hosting auf Vercel vor.

Bisheriges Hosting: Hetzner mit Caddy unter https://s-l-baggerarbeiten.de

## Was hier liegt

Der ausgelieferte Build der Seite, gespiegelt am 3. September 2026. Alle 54 Dateien sind byteweise identisch mit dem, was der Server zu diesem Zeitpunkt herausgegeben hat.

Der React-Quellcode fehlt. Der Server gibt nur das fertige Bundle heraus, Sourcemaps liefert er nicht mit. Wenn du das ursprüngliche Vite-Projekt noch auf einer Platte hast, gehört es hierher, und die Dateien unten werden dann zum Ergebnis von `npm run build`.

```
index.html              Einstiegspunkt, Meta-Tags, LocalBusiness-Schema
assets/                 gehashtes JS-Bundle und CSS
img/                    Hero-Bilder und 8 Galerie-Motive, je als JPG und WebP
fonts/                  Inter und Archivo, lokal gehostet
logo/                   Emblem hell und dunkel
favicon.ico, apple-touch-icon.png
vercel.json             Rewrites und Header
```

## Lokal ansehen

```bash
python3 -m http.server 4173
```

Danach http://localhost:4173 öffnen. Die Unterseiten `/impressum` und `/datenschutz` laufen mit diesem Server ins Leere, weil er den SPA-Fallback nicht kennt. Über die Vercel-CLI funktionieren sie:

```bash
npx vercel dev
```

## Deployment auf Vercel

Beim Import des Repos als Framework Preset **Other** wählen, das Build Command leer lassen und als Output Directory das Wurzelverzeichnis eintragen. Vercel liefert die Dateien dann direkt aus, ohne Build-Schritt.

`vercel.json` erledigt zwei Dinge:

- **Rewrites.** Jeder Pfad, der auf keine vorhandene Datei zeigt, landet auf `index.html`. Das braucht der React-Router für `/impressum` und `/datenschutz`.
- **Header.** Die Security-Header, die vorher Caddy gesetzt hat (CSP, HSTS, Referrer-Policy, Permissions-Policy, X-Frame-Options, X-Content-Type-Options), dazu `Cache-Control` für die gehashten Dateien in `assets/` und `fonts/`.

## Domain umstellen

1. Repo auf Vercel deployen und das Ergebnis über die Preview-URL prüfen, besonders Galerie, Impressum und Datenschutz.
2. `s-l-baggerarbeiten.de` im Vercel-Projekt unter Domains hinzufügen.
3. Beim DNS-Anbieter den A-Record von `167.233.236.207` auf die Adresse ändern, die Vercel anzeigt. `www` zeigt als CNAME auf Vercel.
4. Den Hetzner-Server noch ein paar Tage weiterlaufen lassen, bis die Änderung überall angekommen ist.

## Offene Punkte

- `og:image` in der `index.html` zeigt auf einen relativen Pfad. Für die Linkvorschau bei WhatsApp, Facebook und LinkedIn braucht es dort eine absolute URL mit Domain.
- `robots.txt` und `sitemap.xml` gibt es nicht. Beide Pfade liefern derzeit die SPA aus.
