import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Stellt bei jeder Navigation die Scroll-Position her: mit Anker in der
 * Adresse zum Ziel, sonst an den Seitenanfang. Bei Anker-Klicks auf
 * derselben Seite scrollt zusätzlich der Browser selbst — beide zielen
 * auf dasselbe Element, scroll-padding-top wird in beiden Fällen
 * berücksichtigt.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default ScrollManager
