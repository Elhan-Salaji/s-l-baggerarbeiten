# ADR 0004: Spamschutz mit Honeypot und Rate-Limiting

## Status

Akzeptiert

## Kontext

Ein öffentliches Kontaktformular zieht automatisierten Spam an. Jede durchgelassene Anfrage wird zur E-Mail an den Betreiber, der Schutz muss also serverseitig greifen. Ein Captcha wäre wirksam, verschlechtert aber die Bedienung und bindet meist einen Drittanbieter ein, den die Seite bewusst nicht hat (ADR 0003).

## Entscheidung

Zwei leichtgewichtige Maßnahmen im Backend, ohne zusätzliche Abhängigkeiten:

- **Honeypot-Feld.** Das Formular enthält ein für Menschen unsichtbares Feld `website`. Füllt ein Bot es aus, verwirft das Backend die Anfrage still und antwortet mit demselben 200 wie bei einer echten Anfrage. Der Bot erfährt nicht, dass er aufgeflogen ist. Das Muster stammt von der statischen Seite und hat sich dort bewährt.
- **Rate-Limiting im Speicher.** Ein fester Zähler je Client-Adresse erlaubt 5 Anfragen pro Stunde, die sechste bekommt 429. Die Umsetzung ist eine `ConcurrentHashMap` mit Zeitfenstern, eine injizierte `Clock` macht sie testbar. Hinter Caddy liefert `forward-headers-strategy: framework` die echte Client-Adresse; das ist sicher, weil nur Caddy das Backend erreicht.

Verworfene Alternativen:

- **Captcha:** Hürde für die Zielgruppe (Privatkunden, oft mobil), Drittanbieter, Cookie- und Datenschutzfragen.
- **Rate-Limiting im Reverse Proxy:** Caddy braucht dafür ein Plugin und damit ein eigenes Image statt des offiziellen. Die Regel gehört zudem fachlich zum Formular, nicht zur Infrastruktur.
- **Persistenter Zähler:** Eine Datenbank nur für das Rate-Limiting widerspräche ADR 0003.

## Konsequenzen

- Ein Neustart des Backends setzt die Zähler zurück, und mehrere Instanzen würden getrennt zählen. Für eine Instanz und das erwartete Aufkommen (Handvoll Anfragen pro Tag) ist das belanglos.
- Hinter einem gemeinsamen Anschluss (Carrier-NAT, Firmennetz) teilen sich mehrere Nutzer ein Kontingent. 5 Anfragen pro Stunde lassen dafür Luft.
- Gegen gezielten, verteilten Spam hilft das Konzept nur begrenzt. Reicht es nicht mehr, ist ein Captcha die nächste Stufe und ein neues ADR.
