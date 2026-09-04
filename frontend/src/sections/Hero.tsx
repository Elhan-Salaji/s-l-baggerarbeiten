function Hero() {
  return (
    <section className="hero" id="start" aria-labelledby="hero-titel">
      <picture className="hero__picture">
        <source
          type="image/webp"
          media="(max-width: 767px)"
          srcSet="/img/hero-mobile-640.webp 640w, /img/hero-mobile-900.webp 900w"
          sizes="100vw"
        />
        <source
          media="(max-width: 767px)"
          srcSet="/img/hero-mobile-640.jpg 640w, /img/hero-mobile-900.jpg 900w"
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet="/img/hero-desktop-1200.webp 1200w, /img/hero-desktop-1800.webp 1800w"
          sizes="100vw"
        />
        <img
          className="hero__img"
          src="/img/hero-desktop-1800.jpg"
          srcSet="/img/hero-desktop-1200.jpg 1200w, /img/hero-desktop-1800.jpg 1800w"
          sizes="100vw"
          width={1800}
          height={810}
          fetchPriority="high"
          decoding="async"
          alt="Roter 1,2-Tonnen-Minibagger auf einer Wiese am Ortsrand, im Hintergrund ein Dorf und bewaldete Hügel."
        />
      </picture>

      <div className="hero__overlay"></div>

      <div className="container hero__content">
        <p className="hero__eyebrow">Minibagger-Arbeiten im Ortenaukreis</p>
        <h1 className="hero__title" id="hero-titel">Präzise Baggerarbeiten: flexibel, klein, leistungsstark</h1>
        <p className="hero__text">
          Sie suchen einen zuverlässigen Partner für Baggerarbeiten, auch an schwer zugänglichen
          Stellen? Mit meinem 1,2-Tonnen-Minibagger erledige ich Arbeiten, die mit großen
          Maschinen oft nicht möglich sind, und bringe die Maschine genau dorthin, wo sie
          gebraucht wird.
        </p>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#kontakt">Angebot anfragen</a>
          <a className="btn btn--secondary" href="#leistungen">Leistungen ansehen</a>
        </div>

        <ul className="hero__usp" aria-label="Das macht den Minibagger besonders">
          <li className="usp">
            <span className="usp__value">1,2 t</span>
            <span className="usp__label">Einsatzgewicht</span>
          </li>
          <li className="usp">
            <span className="usp__value">90 cm</span>
            <span className="usp__label">Durchfahrtsbreite</span>
          </li>
          <li className="usp">
            <span className="usp__value">Demontage Baggerdach</span>
            <span className="usp__label">passt durch Türen</span>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Hero
