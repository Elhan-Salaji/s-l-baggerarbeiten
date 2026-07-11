import { useEffect, useRef, useState } from 'react'
import type { GalleryImage } from '../sections/Gallery'

type LightboxProps = {
  images: readonly GalleryImage[]
  startIndex: number
  onClose: () => void
}

/**
 * Vergrößerte Galerie-Ansicht als modaler Dialog: blättern mit Maus
 * und Pfeiltasten, Escape oder Klick auf den Hintergrund schließt,
 * der Fokus bleibt in der Lightbox und kehrt danach zum Auslöser zurück.
 */
function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  // Beim Öffnen: Hintergrund-Scrollen sperren und den Schließen-Knopf
  // fokussieren. Beim Schließen kehrt der Fokus zum Auslöser zurück.
  useEffect(() => {
    const lastFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      if (lastFocused instanceof HTMLElement) lastFocused.focus()
    }
  }, [])

  const image = images[index]

  function go(step: number) {
    setIndex((current) => (current + step + images.length) % images.length)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        go(-1)
        break
      case 'ArrowRight':
        go(1)
        break
      case 'Tab': {
        // Fokus innerhalb der Lightbox halten.
        const focusable = [closeRef.current, prevRef.current, nextRef.current]
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
        break
      }
      default:
        break
    }
  }

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Galerie, vergrößerte Ansicht"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={onKeyDown}
    >
      <span className="lightbox__counter" aria-hidden="true">{index + 1} / {images.length}</span>
      <button ref={closeRef} className="lightbox__close" type="button" aria-label="Schließen" onClick={onClose}>
        &times;
      </button>
      <button ref={prevRef} className="lightbox__nav lightbox__prev" type="button" aria-label="Vorheriges Bild" onClick={() => go(-1)}>
        &#8249;
      </button>
      <figure className="lightbox__figure">
        <img className="lightbox__img" src={`/img/galerie-${image.slug}-full.webp`} alt={image.alt} />
        <figcaption className="lightbox__caption">{image.caption}</figcaption>
      </figure>
      <button ref={nextRef} className="lightbox__nav lightbox__next" type="button" aria-label="Nächstes Bild" onClick={() => go(1)}>
        &#8250;
      </button>
    </div>
  )
}

export default Lightbox
