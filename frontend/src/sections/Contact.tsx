import { Link } from 'react-router-dom'

function Contact() {
  // Honeypot: füllt ein Bot das versteckte Feld, wird der Versand abgebrochen.
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const trap = event.currentTarget.elements.namedItem('_gotcha') as HTMLInputElement | null
    if (trap && trap.value !== '') event.preventDefault()
  }

  return (
    <section className="section section--tint contact" id="kontakt" aria-labelledby="contact-titel">
      <div className="container contact__grid">
        <div className="contact__intro">
          <p className="eyebrow">Kontakt</p>
          <h2 className="section__title" id="contact-titel">Starten Sie Ihr Projekt</h2>
          <p className="section__intro">
            Sie haben ein Projekt für meinen Minibagger? Schreiben Sie mir, ich erstelle Ihnen
            gern ein unverbindliches Angebot.
          </p>

          <ul className="contact-list">
            <li className="contact-list__item">
              <span className="contact-list__label">Telefon</span>
              <a className="contact-list__value" href="tel:+4915752675620">0157 52675620</a>
            </li>
            <li className="contact-list__item">
              <span className="contact-list__label">E-Mail</span>
              <a className="contact-list__value" href="mailto:s.l.baggerarbeiten@web.de">s.l.baggerarbeiten@web.de</a>
            </li>
            <li className="contact-list__item">
              <span className="contact-list__label">Einsatzgebiet</span>
              <span className="contact-list__value">Ortenaukreis</span>
            </li>
          </ul>
        </div>

        {/* Versand über einen Formular-Dienst. Vor dem Live-Gang die Adresse
            in action= eintragen. Die Anbindung an die eigene Kontakt-API
            ersetzt diesen Weg. */}
        <form
          className="form"
          id="kontaktformular"
          action="https://formspree.io/f/DEINE-FORM-ID"
          method="post"
          aria-labelledby="form-titel"
          onSubmit={onSubmit}
        >
          <h3 className="form__title" id="form-titel">Anfrage senden</h3>

          <input type="hidden" name="_subject" value="Neue Anfrage über die Webseite" />

          <div className="form__field">
            <label className="form__label" htmlFor="feld-name">Name</label>
            <input className="form__control" id="feld-name" name="name" type="text" autoComplete="name" required />
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="feld-email">E-Mail</label>
            <input className="form__control" id="feld-email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="feld-nachricht">Nachricht</label>
            <textarea className="form__control" id="feld-nachricht" name="nachricht" rows={5} required></textarea>
          </div>

          {/* Honeypot: für Menschen unsichtbar, fängt automatisierten Spam ab. */}
          <div className="form__honeypot" aria-hidden="true">
            <label htmlFor="feld-website">Webseite (bitte frei lassen)</label>
            <input id="feld-website" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="form__check">
            <input className="form__checkbox" id="feld-datenschutz" name="datenschutz" type="checkbox" required />
            <label className="form__check-label" htmlFor="feld-datenschutz">
              Ich habe die <Link to="/datenschutz">Datenschutzerklärung</Link> gelesen und bin einverstanden.
            </label>
          </div>

          <button className="btn btn--primary btn--block" type="submit">Anfrage senden</button>

          <p className="form__hint">
            Lieber telefonisch? Rufen Sie an unter <a href="tel:+4915752675620">0157 52675620</a>.
          </p>
        </form>
      </div>
    </section>
  )
}

export default Contact
