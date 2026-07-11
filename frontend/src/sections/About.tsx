function About() {
  return (
    <section className="section about" id="ueber-mich" aria-labelledby="about-titel">
      <div className="container about__grid">
        <div className="about__main">
          <p className="eyebrow">Über mich</p>
          <h2 className="section__title" id="about-titel">Ihr flexibler Partner für Minibaggerarbeiten</h2>
          <p className="about__lead">
            Ich bin auf Minibaggerarbeiten spezialisiert und übernehme Projekte, bei denen große
            Maschinen nicht hinkommen. Klein, wendig und leistungsstark arbeite ich auch in engen
            Gärten und auf beengten Baustellen präzise.
          </p>
          <p>
            Mit Erfahrung und einem Auge fürs Detail setze ich jedes Projekt termingerecht und
            sauber um. Vom ersten Aushub bis zum fertigen Planum bleibt alles in einer Hand.
          </p>
        </div>

        <aside className="about__facts" aria-label="Gut zu wissen">
          <h3 className="facts__title">Gut zu wissen</h3>
          <ul className="facts">
            <li className="facts__item">Einsatzgebiet im gesamten Ortenaukreis</li>
            <li className="facts__item">Persönlich vom Inhaber, vom Angebot bis zur Abnahme</li>
            <li className="facts__item">Zugänge ab 90 cm Breite kein Problem</li>
            <li className="facts__item">Termingerecht und sauber, auch auf engem Raum</li>
          </ul>
          <a className="btn btn--primary btn--block" href="#kontakt">Projekt besprechen</a>
        </aside>
      </div>
    </section>
  )
}

export default About
