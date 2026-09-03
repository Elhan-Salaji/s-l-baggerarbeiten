# ADR 0006: Betrieb auf Vercel statt eigenem Server

## Status

Akzeptiert

## Kontext

Die Seite läuft seit Version 2.0.0 auf einem eigenen Server bei Hetzner:
Docker Compose mit drei Containern, davor Caddy für TLS und Weiterleitung
(ADR 0005). Der Betreiber pflegt diesen Server allein, neben seiner
eigentlichen Arbeit. Für eine Seite mit fünf Abschnitten, zwei Rechtsseiten
und einem Kontaktformular ist das viel Technik: Betriebssystem-Updates,
Container-Neustarts, Zertifikate, Healthchecks.

Inhaltlich braucht die Seite genau zwei Dinge: die Auslieferung eines
statischen Vite-Builds und einen Endpunkt, der eine Formularanfrage als
E-Mail weiterreicht.

## Entscheidung

Der Betrieb zieht vollständig auf Vercel um.

- **Frontend.** Vercel baut den Vite-Build aus dem Repository und liefert
  ihn über sein CDN aus. Die Header und Cache-Regeln, die vorher Caddy und
  nginx gesetzt haben, stehen in `frontend/vercel.json`. Unbekannte Pfade
  fallen auf `index.html` zurück, damit die Routen `/impressum` und
  `/datenschutz` weiter direkt aufrufbar sind.
- **Kontaktformular.** Der Endpunkt `POST /api/kontakt` wird eine
  Serverless-Funktion in TypeScript (`frontend/api/kontakt.ts`). Sie
  übernimmt Verhalten und Antwortformat des bisherigen Spring-Controllers
  eins zu eins: dieselben deutschen Feldmeldungen, dasselbe ProblemDetail
  nach RFC 9457, Honeypot, Rate-Limiting, 503 bei Versandfehlern.
- **Mailversand.** `nodemailer` spricht denselben SMTP-Zugang bei IONOS an
  wie vorher Spring. Die Zugangsdaten kommen aus Umgebungsvariablen, die
  in Vercel hinterlegt sind, und tragen dieselben Namen wie bisher.

Verworfene Alternativen:

- **Backend auf dem Server behalten, Frontend auf Vercel.** Der Server
  bliebe samt Pflege und Kosten bestehen, dazu kämen CORS-Regeln und eine
  gelockerte CSP für die API-Subdomain. Der Aufwand steigt, statt zu sinken.
- **Externer Formular-Dienst.** Widerspricht ADR 0001 und ADR 0003: Die
  Seite kommt bewusst ohne Drittanbieter im Formularweg aus, und die
  Datenschutzerklärung beschreibt genau das.

## Konsequenzen

- ADR 0005 ist abgelöst. Docker Compose, Caddy und die drei Container
  beschreiben nicht mehr, wie die Seite betrieben wird.
- Das Spring-Backend wird nicht mehr deployt. Der Code bleibt bis zur
  DNS-Umstellung im Repository, weil der alte Server so lange der
  Rollback-Weg ist.
- Der Spamschutz aus ADR 0004 wird schwächer. Das Rate-Limiting zählt im
  Speicher, und Vercel startet unter Last mehrere Instanzen nebeneinander,
  die getrennt zählen. Für das erwartete Aufkommen von wenigen Anfragen am
  Tag trägt das; wächst der Spam, ist ein geteilter Zähler über Vercel KV
  die nächste Stufe und ein neues ADR.
- Die Datenschutzerklärung nennt künftig Vercel als Hoster. Vercel Inc.
  sitzt in den USA, die Auftragsverarbeitung und der Drittlandtransfer
  gehören in den Text.
- Die Tests des Backends (JUnit) entfallen mit dem Backend. Validierung,
  Honeypot und Rate-Limiting sind mit Vitest neu abgedeckt.
