import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KontaktApiFehler, sendeKontaktanfrage } from '../api/kontakt'

type SendeStatus = 'idle' | 'sending' | 'success' | 'error'

const LEERE_EINGABEN = {
  name: '',
  email: '',
  nachricht: '',
  datenschutz: false,
  website: '', // Honeypot: für Menschen unsichtbar, bleibt leer.
}

function Contact() {
  const [eingaben, setEingaben] = useState(LEERE_EINGABEN)
  const [status, setStatus] = useState<SendeStatus>('idle')
  const [fehlermeldung, setFehlermeldung] = useState('')
  const [feldFehler, setFeldFehler] = useState<Record<string, string>>({})

  function setzeEingabe(feld: keyof typeof LEERE_EINGABEN, wert: string | boolean) {
    setEingaben((bisher) => ({ ...bisher, [feld]: wert }))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setFehlermeldung('')
    setFeldFehler({})

    try {
      await sendeKontaktanfrage(eingaben)
      setStatus('success')
      setEingaben(LEERE_EINGABEN)
    } catch (fehler) {
      setStatus('error')
      if (fehler instanceof KontaktApiFehler && fehler.status === 400) {
        setFeldFehler(fehler.felder)
        setFehlermeldung('Bitte prüfen Sie Ihre Eingaben.')
      } else if (fehler instanceof KontaktApiFehler && fehler.status === 429) {
        setFehlermeldung('Zu viele Anfragen. Bitte versuchen Sie es später erneut.')
      } else {
        setFehlermeldung('Ihre Nachricht konnte gerade nicht übermittelt werden. '
          + 'Bitte versuchen Sie es später erneut oder rufen Sie an: 0157 52675620.')
      }
    }
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
              <a className="contact-list__value" href="mailto:info@s-l-baggerarbeiten.de">info@s-l-baggerarbeiten.de</a>
            </li>
            <li className="contact-list__item">
              <span className="contact-list__label">Einsatzgebiet</span>
              <span className="contact-list__value">Ortenaukreis</span>
            </li>
          </ul>
        </div>

        <form className="form" id="kontaktformular" aria-labelledby="form-titel" onSubmit={onSubmit}>
          <h3 className="form__title" id="form-titel">Anfrage senden</h3>

          <div className="form__field">
            <label className="form__label" htmlFor="feld-name">Name</label>
            <input
              className="form__control"
              id="feld-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={eingaben.name}
              onChange={(event) => setzeEingabe('name', event.target.value)}
              aria-invalid={feldFehler.name ? true : undefined}
              aria-describedby={feldFehler.name ? 'fehler-name' : undefined}
            />
            {feldFehler.name && <p className="form__error" id="fehler-name">{feldFehler.name}</p>}
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="feld-email">E-Mail</label>
            <input
              className="form__control"
              id="feld-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              value={eingaben.email}
              onChange={(event) => setzeEingabe('email', event.target.value)}
              aria-invalid={feldFehler.email ? true : undefined}
              aria-describedby={feldFehler.email ? 'fehler-email' : undefined}
            />
            {feldFehler.email && <p className="form__error" id="fehler-email">{feldFehler.email}</p>}
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="feld-nachricht">Nachricht</label>
            <textarea
              className="form__control"
              id="feld-nachricht"
              name="nachricht"
              rows={5}
              required
              minLength={10}
              maxLength={5000}
              value={eingaben.nachricht}
              onChange={(event) => setzeEingabe('nachricht', event.target.value)}
              aria-invalid={feldFehler.nachricht ? true : undefined}
              aria-describedby={feldFehler.nachricht ? 'fehler-nachricht' : undefined}
            ></textarea>
            {feldFehler.nachricht && <p className="form__error" id="fehler-nachricht">{feldFehler.nachricht}</p>}
          </div>

          {/* Honeypot: für Menschen unsichtbar, fängt automatisierten Spam ab. */}
          <div className="form__honeypot" aria-hidden="true">
            <label htmlFor="feld-website">Webseite (bitte frei lassen)</label>
            <input
              id="feld-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={eingaben.website}
              onChange={(event) => setzeEingabe('website', event.target.value)}
            />
          </div>

          <div className="form__check">
            <input
              className="form__checkbox"
              id="feld-datenschutz"
              name="datenschutz"
              type="checkbox"
              required
              checked={eingaben.datenschutz}
              onChange={(event) => setzeEingabe('datenschutz', event.target.checked)}
            />
            <label className="form__check-label" htmlFor="feld-datenschutz">
              Ich habe die <Link to="/datenschutz">Datenschutzerklärung</Link> gelesen und bin einverstanden.
            </label>
          </div>

          {status === 'success' && (
            <p className="form__feedback form__feedback--success" role="status">
              Vielen Dank für Ihre Anfrage. Ich melde mich so schnell wie möglich bei Ihnen.
            </p>
          )}
          {status === 'error' && (
            <p className="form__feedback form__feedback--error" role="alert">{fehlermeldung}</p>
          )}

          <button className="btn btn--primary btn--block" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Wird gesendet…' : 'Anfrage senden'}
          </button>

          <p className="form__hint">
            Lieber telefonisch? Rufen Sie an unter <a href="tel:+4915752675620">0157 52675620</a>.
          </p>
        </form>
      </div>
    </section>
  )
}

export default Contact
