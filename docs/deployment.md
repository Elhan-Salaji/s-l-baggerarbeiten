# Deployment auf Vercel

Die Seite läuft auf Vercel. Vercel baut bei jedem Push auf `main` den
Vite-Build, veröffentlicht ihn und stellt die Kontakt-API als
Serverless-Funktion daneben. Branches bekommen automatisch eine
Preview-URL, unter der sich Änderungen vor dem Merge ansehen lassen.

Warum dieser Weg, steht in
[ADR 0006](adr/0006-betrieb-auf-vercel-statt-eigenem-server.md).

## 1. Projekt anlegen

In Vercel *Add New Project*, das GitHub-Repository auswählen und diese
Einstellungen setzen:

| Feld | Wert |
|------|------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Build- und Output-Einstellungen stehen auch in `frontend/vercel.json`,
Vercel übernimmt sie beim Import von dort.

## 2. Umgebungsvariablen

Unter *Settings, Environment Variables* für Production und Preview
anlegen. Die Namen sind dieselben wie im alten Serverbetrieb:

| Variable | Wert |
|----------|------|
| `SMTP_HOST` | SMTP-Server des Mailanbieters |
| `SMTP_PORT` | `587` für STARTTLS, `465` für direktes TLS |
| `SMTP_USERNAME` | Postfach oder Benutzername beim Anbieter |
| `SMTP_PASSWORD` | Passwort des Postfachs |
| `MAIL_FROM` | fester Absender, muss zum SMTP-Konto passen (SPF/DKIM) |
| `MAIL_RECIPIENT` | Postfach, das die Anfragen bekommt |

Ohne diese Werte antwortet `POST /api/kontakt` mit 503, und im
Funktions-Log steht, welche Variable fehlt.

## 3. Prüfen

Auf der Preview-URL, vor jeder DNS-Änderung:

- Startseite lädt mit Hero-Bild, Logo und Galerie.
- `/impressum` und `/datenschutz` direkt in der Adresszeile aufrufen,
  nicht nur über die Links im Footer. Das prüft den Fallback aus
  `vercel.json`.
- Kontaktformular abschicken und nachsehen, ob die Mail ankommt.
- Formular mit leeren Feldern abschicken: Es müssen die Feldmeldungen
  erscheinen, nicht ein allgemeiner Fehler.

```
curl -i -X POST https://<preview>.vercel.app/api/kontakt \
  -H 'Content-Type: application/json' \
  -d '{"name":"","email":"kaputt","nachricht":"kurz","datenschutz":false,"website":""}'
```

Die Antwort muss `400` sein und im Feld `felder` je Eingabe eine
deutsche Meldung tragen.

## 4. Domain umstellen

1. In Vercel unter *Settings, Domains* `s-l-baggerarbeiten.de` und
   `www.s-l-baggerarbeiten.de` hinzufügen. Vercel zeigt die nötigen
   DNS-Einträge an und leitet `www` auf die Hauptdomain um.
2. Beim DNS-Anbieter den A-Record der Hauptdomain auf die von Vercel
   genannte Adresse ändern, `www` als CNAME auf den Vercel-Host.
3. Warten, bis Vercel beide Domains als *Valid Configuration* führt und
   die Zertifikate ausgestellt sind.
4. Die veröffentlichte Seite noch einmal wie unter Schritt 3 prüfen,
   diesmal unter der echten Domain.

Den alten Server erst danach abschalten, mit einigen Tagen Abstand: Bis
die DNS-Änderung überall angekommen ist, landen Besucher noch dort.

## 5. Zurückrollen

Zwei Wege, je nachdem was kaputt ist:

- **Schlechtes Deployment.** In Vercel unter *Deployments* das letzte
  funktionierende auswählen und *Promote to Production*.
- **Vercel insgesamt.** Den A-Record zurück auf die Server-IP zeigen
  lassen. Dafür muss der alte Server laufen, siehe
  [deployment-server.md](deployment-server.md).

## Nach dem Umzug

Sobald die Domain auf Vercel zeigt und ein paar Wochen ohne Zwischenfall
vergangen sind, können `backend/` und `docker/` aus dem Repository
verschwinden und der Server gekündigt werden. Bis dahin sind sie der
Rückweg.
