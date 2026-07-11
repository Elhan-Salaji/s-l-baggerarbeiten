import { useEffect, useRef, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'

const NAV_ITEMS = [
  { id: 'start', label: 'Start' },
  { id: 'ueber-mich', label: 'Über mich' },
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'kontakt', label: 'Kontakt', cta: true },
] as const

const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection(SECTION_IDS)

  // Klick außerhalb des Headers oder Escape schließt das offene Menü;
  // Escape gibt den Fokus an den Menü-Knopf zurück.
  useEffect(() => {
    if (!menuOpen) return

    function onClick(event: MouseEvent) {
      if ((event.target as Element).closest('.site-header')) return
      setMenuOpen(false)
    }
    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeydown)
    }
  }, [menuOpen])

  return (
    <header className="site-header" id="seitenanfang">
      <div className="container site-header__inner">
        <a className="brand" href="#seitenanfang" aria-label="S.L. Baggerarbeiten, zur Startseite">
          <picture>
            <source type="image/webp" srcSet="/logo/logo-emblem-light.webp" />
            <img className="brand__emblem" src="/logo/logo-emblem-light.png" width={191} height={144} alt="" />
          </picture>
          <span className="brand__name"><span className="brand__name-accent">S.L.</span> Baggerarbeiten</span>
        </a>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="hauptnavigation"
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-toggle__bar"></span>
          <span className="nav-toggle__bar"></span>
          <span className="nav-toggle__bar"></span>
        </button>

        <nav className={menuOpen ? 'nav is-open' : 'nav'} id="hauptnavigation" aria-label="Hauptnavigation">
          <ul className="nav__list">
            {NAV_ITEMS.map((item) => (
              <li className="nav__item" key={item.id}>
                <a
                  className={'cta' in item && item.cta ? 'nav__link nav__link--cta' : 'nav__link'}
                  href={`#${item.id}`}
                  aria-current={activeId === item.id || undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
