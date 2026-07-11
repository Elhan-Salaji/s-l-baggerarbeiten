// Leistungen pflegen: ein Eintrag pro Karte, das Icon verweist auf ein
// Symbol aus components/IconSprite.tsx.
const SERVICES = [
  { icon: 'i-fundament', title: 'Fundamentaushub', detail: 'Baugruben für Haus, Garage oder Anbau ausheben.' },
  { icon: 'i-leitung', title: 'Leitungsarbeiten', detail: 'Gräben für Strom, Wasser und Leerrohre.' },
  { icon: 'i-versickerung', title: 'Gräben und Versickerung', detail: 'Gräben und Versickerungsmulden ausheben.' },
  { icon: 'i-planum', title: 'Nivellierung und Planum', detail: 'Flächen abziehen und auf Höhe bringen.' },
  { icon: 'i-pflaster', title: 'Pflaster vorbereiten', detail: 'Tragfähigen Unterbau für Wege und Einfahrten.' },
  { icon: 'i-roden', title: 'Flächenräumung', detail: 'Büsche, Wurzeln und Hecken roden.' },
  { icon: 'i-mutterboden', title: 'Mutterboden verteilen', detail: 'Oberboden auftragen und gleichmäßig abziehen.' },
  { icon: 'i-verfuellen', title: 'Arbeitsräume verfüllen', detail: 'Baugruben nach den Arbeiten wieder verfüllen.' },
  { icon: 'i-boeschung', title: 'Böschungen anlegen', detail: 'Hänge und Übergänge sauber anlegen.' },
  { icon: 'i-garten', title: 'Erdbewegungen und Garten', detail: 'Erdarbeiten und Umgestaltung im Garten.' },
]

function Services() {
  return (
    <section className="section section--tint services" id="leistungen" aria-labelledby="services-titel">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Leistungen</p>
          <h2 className="section__title" id="services-titel">Meine Leistungen</h2>
          <p className="section__intro">
            Vom Fundament bis zur Gartengestaltung übernehme ich die Erd- und Aushubarbeiten rund
            um Ihr Projekt.
          </p>
        </div>

        <ul className="services__grid">
          {SERVICES.map((service) => (
            <li className="service" key={service.icon}>
              <svg className="service__icon" aria-hidden="true"><use href={`#${service.icon}`}></use></svg>
              <h3 className="service__title">{service.title}</h3>
              <p className="service__detail">{service.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Services
