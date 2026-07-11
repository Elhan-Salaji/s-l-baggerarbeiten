import { useEffect } from 'react'

/**
 * Nach einem Klick auf einen Anker-Link wandert der Tastatur- und
 * Screenreader-Fokus zum Ziel mit. Das sanfte Scrollen selbst
 * übernimmt CSS (scroll-behavior).
 */
export function useAnchorFocus() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element).closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')!.slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      target.setAttribute('tabindex', '-1')
      requestAnimationFrame(() => target.focus({ preventScroll: true }))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
