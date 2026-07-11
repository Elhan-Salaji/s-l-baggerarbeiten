import { useDocumentTitle } from '../hooks/useDocumentTitle'

function HomePage() {
  useDocumentTitle('S.L. Baggerarbeiten | Minibagger im Ortenaukreis')

  // Die Inhaltsabschnitte der Startseite folgen mit der Migration der
  // einzelnen Sektionen.
  return <main id="inhalt" />
}

export default HomePage
