import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * Rahmen für Impressum und Datenschutz: schlanker Header mit Weg
 * zurück zur Startseite, schmale Textspalte, reduzierter Footer.
 */
function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" to="/" aria-label="S.L. Baggerarbeiten, zur Startseite">
            <picture>
              <source type="image/webp" srcSet="/logo/logo-emblem-light.webp" />
              <img className="brand__emblem" src="/logo/logo-emblem-light.png" width={191} height={144} alt="" />
            </picture>
            <span className="brand__name"><span className="brand__name-accent">S.L.</span> Baggerarbeiten</span>
          </Link>
          <Link className="page-back" to="/">Zur Startseite</Link>
        </div>
      </header>

      <main className="page" id="inhalt">
        <div className="container prose">{children}</div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__bottom">
          <div className="container">
            <p>&copy; 2026 S.L. Baggerarbeiten</p>
            <p>
              <Link to="/">Start</Link> &middot; <Link to="/impressum">Impressum</Link> &middot;{' '}
              <Link to="/datenschutz">Datenschutz</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default LegalLayout
