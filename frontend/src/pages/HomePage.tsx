import Footer from '../components/Footer'
import Header from '../components/Header'
import IconSprite from '../components/IconSprite'
import { useAnchorFocus } from '../hooks/useAnchorFocus'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import About from '../sections/About'
import Hero from '../sections/Hero'
import Services from '../sections/Services'

function HomePage() {
  useDocumentTitle('S.L. Baggerarbeiten | Minibagger im Ortenaukreis')
  useAnchorFocus()

  return (
    <>
      <IconSprite />
      <Header />
      <main id="inhalt">
        <Hero />
        <About />
        <Services />
      </main>
      <Footer />
    </>
  )
}

export default HomePage
