# ADR 0003: Kontaktformular-Backend ohne Datenbank

## Status

Akzeptiert

## Kontext

Das Kontaktformular der statischen Seite brauchte einen externen Formular-Dienst (ADR 0001). Die eigene Lösung soll Anfragen validieren, an den Betreiber weiterleiten und Spam abwehren. Mehr Aufgaben hat das Backend nicht, und der Betreiber will keine zusätzliche Infrastruktur pflegen.

## Entscheidung

Das Backend ist eine Spring-Boot-Anwendung (4.1, Java 21, Maven) mit einem einzigen Endpoint:

- **`POST /api/kontakt`** nimmt die Anfrage als JSON entgegen. Der Aufruf ist synchron: Die Antwort sagt ehrlich, ob die Nachricht den Betreiber erreicht hat. Knappe SMTP-Timeouts halten die Wartezeit im Rahmen.
- **Keine Datenbank.** Anfragen werden sofort per E-Mail weitergeleitet und landen im Postfach des Betreibers. Dort lebt auch der Bestand, eine zweite Ablage wäre nur ein weiterer Ort mit personenbezogenen Daten (DSGVO-Löschfristen inklusive).
- **Versand hinter einem Interface.** `NotificationService` trennt den Endpoint vom Versandweg, `MailNotificationService` implementiert ihn mit `JavaMailSender`. Ein anderer Kanal (etwa ein Messenger) wäre eine neue Implementierung, kein Umbau.
- **Absenderadressen:** `From` ist eine feste, beim SMTP-Anbieter autorisierte Adresse. Die Adresse aus dem Formular wird nur als `Reply-To` gesetzt, sonst lehnen Mailserver den Versand als Fälschung ab (SPF/DKIM).
- **Validierung an der Schnittstelle** über Bean Validation am DTO. Fehler kommen als ProblemDetail (RFC 9457) mit deutschen Feldmeldungen zurück, ein Versandfehler als 503.
- **Kein CORS.** In Produktion liefert derselbe Host Frontend und API aus (Caddy leitet `/api/*` weiter), in der Entwicklung macht der Vite-Proxy die Aufrufe gleich-origin. Was nicht konfiguriert ist, kann nicht falsch konfiguriert sein.
- **OpenAPI über springdoc** dokumentiert den Endpoint, die Swagger-UI läuft nur im Dev-Profil.

## Konsequenzen

- Betrieb und Datenschutz bleiben einfach: kein Datenbank-Container, keine Backups, keine Löschkonzepte im Backend.
- Fällt der SMTP-Anbieter aus, gehen in dieser Zeit keine Anfragen verloren, sie kommen gar nicht erst an. Das Formular zeigt den Fehler und nennt die Telefonnummer als Ausweg.
- Der Betreiber braucht einen SMTP-Zugang mit passenden SPF/DKIM-Einträgen für die Absenderadresse, sonst landen Anfragen im Spam-Ordner.
