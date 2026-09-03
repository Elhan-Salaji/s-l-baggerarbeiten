import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <picture>
            <source type="image/webp" srcSet="/logo/logo-emblem-dark.webp" />
            <img className="site-footer__emblem" src="/logo/logo-emblem-dark.png" width={191} height={144} alt="" />
          </picture>
          <p className="site-footer__name"><span className="brand__name-accent">S.L.</span> Baggerarbeiten</p>
          <p className="site-footer__tagline">Minibaggerarbeiten im Ortenaukreis.</p>
        </div>

        <nav className="site-footer__col" aria-label="Seiten">
          <h2 className="site-footer__heading">Seite</h2>
          <ul className="site-footer__list">
            <li><a href="#start">Start</a></li>
            <li><a href="#ueber-mich">Über mich</a></li>
            <li><a href="#leistungen">Leistungen</a></li>
            <li><a href="#referenzen">Referenzen</a></li>
            <li><a href="#kontakt">Kontakt</a></li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">Kontakt</h2>
          <ul className="site-footer__list">
            <li><a href="tel:+4915752675620">0157 52675620</a></li>
            <li><a href="mailto:info@s-l-baggerarbeiten.de">info@s-l-baggerarbeiten.de</a></li>
            <li><a href="mailto:s.l.baggerarbeiten@web.de">s.l.baggerarbeiten@web.de</a></li>
            <li>Ortenaukreis</li>
          </ul>
        </div>

        <nav className="site-footer__col" aria-label="Rechtliches">
          <h2 className="site-footer__heading">Rechtliches</h2>
          <ul className="site-footer__list">
            <li><Link to="/impressum">Impressum</Link></li>
            <li><Link to="/datenschutz">Datenschutz</Link></li>
          </ul>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <div className="container">
          <p>&copy; 2026 S.L. Baggerarbeiten</p>
          <p>Einsatzgebiet: Ortenaukreis</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
