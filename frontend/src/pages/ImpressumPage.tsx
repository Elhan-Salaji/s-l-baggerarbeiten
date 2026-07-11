import LegalLayout from '../components/LegalLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function ImpressumPage() {
  useDocumentTitle('Impressum | S.L. Baggerarbeiten')

  return (
    <LegalLayout>
      <p className="notice">
        <strong>Hinweis:</strong> Diese Seite ist eine Vorlage. Alle{' '}
        <span className="placeholder">[Platzhalter in eckigen Klammern]</span> vor der
        Veröffentlichung durch die echten Daten ersetzen und das Impressum rechtlich prüfen lassen.
      </p>

      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 DDG</h2>
      <address>
        <span className="placeholder">[Vorname Nachname]</span><br />
        S.L. Baggerarbeiten<br />
        <span className="placeholder">[Straße und Hausnummer]</span><br />
        <span className="placeholder">[PLZ]</span> <span className="placeholder">[Ort]</span>
      </address>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+4915752675620">0157 52675620</a><br />
        E-Mail: <a href="mailto:info@s-l-baggerarbeiten.de">info@s-l-baggerarbeiten.de</a>
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:{' '}
        <span className="placeholder">[USt-IdNr., falls vorhanden, sonst diesen Abschnitt entfernen]</span>.
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <address>
        <span className="placeholder">[Vorname Nachname]</span><br />
        <span className="placeholder">[Anschrift wie oben]</span>
      </address>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Ich bin nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </LegalLayout>
  )
}

export default ImpressumPage
