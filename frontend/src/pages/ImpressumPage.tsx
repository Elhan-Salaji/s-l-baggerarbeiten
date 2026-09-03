import LegalLayout from '../components/LegalLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function ImpressumPage() {
  useDocumentTitle('Impressum | S.L. Baggerarbeiten')

  return (
    <LegalLayout>
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 DDG</h2>
      <address>
        Sven Leitermann<br />
        S.L. Baggerarbeiten<br />
        Pfarrer-Schwab-Weg 4<br />
        77948 Friesenheim
      </address>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+4915752675620">0157 52675620</a><br />
        E-Mail: <a href="mailto:info@s-l-baggerarbeiten.de">info@s-l-baggerarbeiten.de</a><br />
        E-Mail: <a href="mailto:s.l.baggerarbeiten@web.de">s.l.baggerarbeiten@web.de</a>
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <address>
        Sven Leitermann<br />
        Pfarrer-Schwab-Weg 4<br />
        77948 Friesenheim
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
