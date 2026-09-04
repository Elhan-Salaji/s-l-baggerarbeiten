import { useState } from 'react'
import type { CSSProperties } from 'react'
import Lightbox from '../components/Lightbox'

export type GalleryImage = {
  slug: string
  width: number
  height: number
  alt: string
  caption: string
  captionShort: string
}

// Wie viele Rasterzeilen eine Kachel belegt. Der Faktor bildet das
// Seitenverhältnis auf das Raster in global.css ab: Ein hohes Bild
// bekommt mehr Zeilen als ein breites, und neue Bilder ordnen sich
// ohne Handarbeit ein.
const ZEILEN_JE_SEITENVERHAELTNIS = 4

function zeilen(breite: number, hoehe: number): number {
  const gewuenscht = Math.round((hoehe / breite) * ZEILEN_JE_SEITENVERHAELTNIS)
  return Math.min(12, Math.max(2, gewuenscht))
}

// Galerie pflegen: Reihenfolge, Bilder und Bildunterschriften. Die
// Dateien liegen unter public/img als galerie-<slug>-thumb/-full in
// WebP und JPEG, erzeugt von tools/optimize-images.py.
const IMAGES: readonly GalleryImage[] = [
  {
    slug: 'minibagger-wiese',
    width: 900,
    height: 405,
    alt: 'Roter 1,2-Tonnen-Minibagger auf einer Wiese am Ortsrand, im Hintergrund ein Dorf und bewaldete Hügel.',
    caption: 'Minibagger am Ortsrand, bereit für den Einsatz auf der Wiese.',
    captionShort: 'Minibagger am Ortsrand',
  },
  {
    slug: 'planum-damm',
    width: 900,
    height: 599,
    alt: 'Minibagger zieht ein ebenes Planum auf einem grasbewachsenen Damm, im Hintergrund eine Brücke.',
    caption: 'Ebenes Planum auf einem grasbewachsenen Damm, im Hintergrund eine Brücke.',
    captionShort: 'Planum auf dem Damm',
  },
  {
    slug: 'leitungsgraben',
    width: 679,
    height: 900,
    alt: 'Roter Minibagger hebt einen schmalen Leitungsgraben im Wohngebiet aus, entlang einer gespannten Richtschnur.',
    caption: 'Schmaler Leitungsgraben im Wohngebiet, ausgehoben entlang einer gespannten Richtschnur.',
    captionShort: 'Leitungsgraben im Wohngebiet',
  },
  {
    slug: 'bachlauf',
    width: 405,
    height: 900,
    alt: 'Roter Minibagger räumt einen wasserführenden Bachlauf und zieht Schlamm aus dem Graben.',
    caption: 'Minibagger räumt einen wasserführenden Bachlauf und zieht Schlamm aus dem Graben.',
    captionShort: 'Bachlauf räumen',
  },
  {
    slug: 'garten-sichtschutz',
    width: 900,
    height: 654,
    alt: 'Roter Minibagger bewegt Erdreich in einem Garten neben einem anthrazitfarbenen WPC-Sichtschutz.',
    caption: 'Erdarbeiten im Garten neben einem anthrazitfarbenen WPC-Sichtschutz.',
    captionShort: 'Erdarbeiten im Garten',
  },
  {
    slug: 'baugrube-hauswand',
    width: 502,
    height: 900,
    alt: 'Eng begrenzte, tiefe Baugrube direkt an einer Hauswand, ausgehoben mit dem Minibagger.',
    caption: 'Eng begrenzte, tiefe Baugrube direkt an einer Hauswand.',
    captionShort: 'Aushub an der Hauswand',
  },
  {
    slug: 'minibagger-feldweg',
    width: 539,
    height: 900,
    alt: 'Roter Minibagger zieht eine schmale Erdbahn durch eine grüne Wiese, dahinter Hügel und blauer Himmel.',
    caption: 'Minibagger zieht eine schmale Erdbahn durch eine grüne Wiese.',
    captionShort: 'Erdbahn durchs Feld',
  },
  {
    slug: 'uferplanum',
    width: 900,
    height: 405,
    alt: 'Minibagger ebnet mit dem Planierlöffel das Ufer entlang eines kleinen Bachs.',
    caption: 'Minibagger ebnet mit dem Planierlöffel das Ufer entlang eines kleinen Bachs.',
    captionShort: 'Planieren am Bachufer',
  },
]

function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <section className="section gallery" id="referenzen" aria-labelledby="gallery-titel">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Referenzen</p>
          <h2 className="section__title" id="gallery-titel">Einblicke in meine Arbeiten</h2>
          <p className="section__intro">
            Überzeugen Sie sich selbst. Die Galerie zeigt, wie vielseitig sich mein Minibagger
            einsetzen lässt, vom Gartenprojekt bis zum präzisen Aushub.
          </p>
        </div>

        <ul className="gallery__grid">
          {IMAGES.map((image, index) => (
            <li
              className="gallery__cell"
              key={image.slug}
              style={{ '--zeilen': zeilen(image.width, image.height) } as CSSProperties}
            >
              {/* Ohne JavaScript wäre href das Ziel; hier öffnet der Klick die Lightbox. */}
              <a
                className="gallery__item"
                href={`/img/galerie-${image.slug}-full.jpg`}
                onClick={(event) => {
                  event.preventDefault()
                  setLightboxIndex(index)
                }}
              >
                <picture>
                  <source type="image/webp" srcSet={`/img/galerie-${image.slug}-thumb.webp`} />
                  <img
                    className="gallery__img"
                    src={`/img/galerie-${image.slug}-thumb.jpg`}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    alt={image.alt}
                  />
                </picture>
                <span className="gallery__caption">{image.captionShort}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={IMAGES} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </section>
  )
}

export default Gallery
