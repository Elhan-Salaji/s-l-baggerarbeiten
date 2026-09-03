import LegalLayout from '../components/LegalLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function DatenschutzPage() {
  useDocumentTitle('Datenschutzerklärung | S.L. Baggerarbeiten')

  return (
    <LegalLayout>
      <h1>Datenschutzerklärung</h1>

      <h2>1. Verantwortlicher</h2>
      <p>Verantwortlich für die Datenverarbeitung auf dieser Webseite ist:</p>
      <address>
        Sven Leitermann<br />
        S.L. Baggerarbeiten<br />
        Pfarrer-Schwab-Weg 4<br />
        77948 Friesenheim<br />
        Telefon: <a href="tel:+4915752675620">0157 52675620</a><br />
        E-Mail: <a href="mailto:info@s-l-baggerarbeiten.de">info@s-l-baggerarbeiten.de</a>
      </address>

      <h2>2. Hosting und Server-Logfiles</h2>
      <p>
        Diese Webseite wird bei Hetzner Online GmbH gehostet. Der Anbieter verarbeitet in
        meinem Auftrag die Daten, die beim Besuch der Webseite anfallen. Grundlage dafür ist
        ein Vertrag über Auftragsverarbeitung nach Art. 28 DSGVO.
      </p>
      <p>Beim Aufruf der Seiten speichert der Server automatisch sogenannte Server-Logfiles. Dazu gehören:</p>
      <ul>
        <li>die gekürzte oder vollständige IP-Adresse des anfragenden Geräts,</li>
        <li>Datum und Uhrzeit des Zugriffs,</li>
        <li>die aufgerufene Seite und die übertragene Datenmenge,</li>
        <li>der verwendete Browser und das Betriebssystem.</li>
      </ul>
      <p>
        Diese Daten dienen dem sicheren und stabilen Betrieb der Webseite. Rechtsgrundlage ist
        mein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO. Die genaue Speicherdauer
        richtet sich nach den Vorgaben des Hosting-Anbieters:{' '}
        <span className="placeholder">[Speicherdauer laut Anbieter eintragen]</span>.
      </p>

      <h2>3. Kontaktaufnahme</h2>
      <p>
        Wenn Sie mich über das Kontaktformular, per E-Mail oder telefonisch erreichen, verarbeite
        ich die von Ihnen übermittelten Angaben, um Ihre Anfrage zu beantworten und ein Angebot zu
        erstellen. Über das Formular sind das Ihr Name, Ihre E-Mail-Adresse und Ihre Nachricht.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertrag
        abzielt, sonst mein berechtigtes Interesse an der Beantwortung nach
        Art. 6 Abs. 1 lit. f DSGVO. Ich speichere die Daten, bis Ihre Anfrage erledigt ist, und
        lösche sie anschließend, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen.
      </p>

      <h2>4. Versand des Kontaktformulars</h2>
      <p>
        Das Kontaktformular übermittelt Ihre Angaben an meinen eigenen Server. Dieser leitet sie
        als E-Mail an mein Postfach weiter, ein externer Formular-Dienst kommt nicht zum Einsatz.
        Für den E-Mail-Versand nutze ich den Anbieter IONOS. Der Server speichert die
        Formulardaten nicht; zur Abwehr automatisierter Anfragen zählt er kurzzeitig die Anzahl
        der Anfragen je IP-Adresse (Rechtsgrundlage: berechtigtes Interesse am störungsfreien
        Betrieb nach Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>5. Schriftarten</h2>
      <p>
        Diese Webseite lädt ihre Schriftarten von meinem eigenen Server. Es besteht keine
        Verbindung zu Google Fonts oder einem anderen externen Anbieter. Beim Laden der
        Schriften werden keine Daten an Dritte übertragen.
      </p>

      <h2>6. Cookies und Analyse</h2>
      <p>
        Diese Webseite setzt keine Cookies und bindet keine Analyse- oder Tracking-Dienste ein.
        Ihr Besuch wird über die genannten Server-Logfiles hinaus nicht ausgewertet.
      </p>

      <h2>7. Ihre Rechte</h2>
      <p>Sie haben gegenüber mir die folgenden Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
      <ul>
        <li>Auskunft über die gespeicherten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO),</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).</li>
      </ul>
      <p>Für die Ausübung dieser Rechte genügt eine Nachricht an die oben genannten Kontaktdaten.</p>

      <h2>8. Beschwerderecht</h2>
      <p>
        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
        Ihrer Daten zu beschweren (Art. 77 DSGVO). Zuständig ist die Aufsichtsbehörde Ihres
        Bundeslandes, in Baden-Württemberg der Landesbeauftragte für den Datenschutz und die
        Informationsfreiheit.
      </p>

      <p className="legal-meta">
        Stand dieser Datenschutzerklärung: Juli 2026.
      </p>
    </LegalLayout>
  )
}

export default DatenschutzPage
