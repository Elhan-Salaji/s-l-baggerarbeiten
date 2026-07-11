import Footer from '../components/Footer'
import Header from '../components/Header'
import { useAnchorFocus } from '../hooks/useAnchorFocus'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function HomePage() {
  useDocumentTitle('S.L. Baggerarbeiten | Minibagger im Ortenaukreis')
  useAnchorFocus()

  // Die Inhaltsabschnitte der Startseite folgen mit der Migration der
  // einzelnen Sektionen.
  return (
    <>
      <Header />
      <main id="inhalt" />
      <Footer />
    </>
  )
}

export default HomePage
