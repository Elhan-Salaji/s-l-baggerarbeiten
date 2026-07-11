import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Stellt beim Seitenwechsel die Scroll-Position her: mit Anker in der
 * Adresse zum Ziel, sonst an den Seitenanfang. Anker-Klicks innerhalb
 * derselben Seite scrollt der Browser selbst (CSS scroll-behavior),
 * deshalb reagiert der Effekt bewusst nur auf den Pfad.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}

export default ScrollManager
