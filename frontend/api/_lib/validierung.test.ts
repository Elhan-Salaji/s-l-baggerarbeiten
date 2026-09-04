import { describe, expect, it } from 'vitest'
import { alsAnfrage, istHoneypotAusgeloest, pruefeAnfrage } from './validierung.js'

const gueltig = {
  name: 'Sven Leitermann',
  email: 'kunde@example.de',
  nachricht: 'Ich brauche einen Leitungsgraben von etwa 20 Metern.',
  datenschutz: true,
  website: '',
}

describe('pruefeAnfrage', () => {
  it('lässt eine gültige Anfrage ohne Meldung durch', () => {
    expect(pruefeAnfrage(gueltig)).toEqual({})
  })

  it('lehnt einen leeren Namen mit Feldmeldung ab', () => {
    expect(pruefeAnfrage({ ...gueltig, name: '   ' })).toEqual({
      name: 'Bitte geben Sie Ihren Namen an.',
    })
  })

  it('lehnt einen überlangen Namen ab', () => {
    const meldungen = pruefeAnfrage({ ...gueltig, name: 'a'.repeat(101) })

    expect(meldungen.name).toBe('Der Name darf höchstens 100 Zeichen lang sein.')
  })

  it('lehnt eine ungültige Mailadresse ab', () => {
    const meldungen = pruefeAnfrage({ ...gueltig, email: 'kein-at-zeichen' })

    expect(meldungen.email).toBe('Bitte geben Sie eine gültige E-Mail-Adresse an.')
  })

  it('lehnt eine zu kurze Nachricht ab', () => {
    const meldungen = pruefeAnfrage({ ...gueltig, nachricht: 'zu kurz' })

    expect(meldungen.nachricht).toBe('Die Nachricht muss zwischen 10 und 5000 Zeichen lang sein.')
  })

  it('lehnt eine fehlende Datenschutz-Zustimmung ab', () => {
    const meldungen = pruefeAnfrage({ ...gueltig, datenschutz: false })

    expect(meldungen.datenschutz).toBe('Bitte stimmen Sie der Datenschutzerklärung zu.')
  })

  it('meldet mehrere Verstöße gemeinsam', () => {
    const meldungen = pruefeAnfrage({ name: '', email: '', nachricht: '', datenschutz: false })

    expect(Object.keys(meldungen).sort()).toEqual(['datenschutz', 'email', 'nachricht', 'name'])
  })

  it('kommt mit fehlenden Feldern und fremden Typen zurecht', () => {
    expect(Object.keys(pruefeAnfrage({})).length).toBe(4)
    expect(Object.keys(pruefeAnfrage({ name: 42, email: null })).length).toBe(4)
  })
})

describe('istHoneypotAusgeloest', () => {
  it('erkennt ein gefülltes Honeypot-Feld', () => {
    expect(istHoneypotAusgeloest({ ...gueltig, website: 'http://spam.example' })).toBe(true)
  })

  it('lässt ein leeres Feld unbeanstandet', () => {
    expect(istHoneypotAusgeloest(gueltig)).toBe(false)
    expect(istHoneypotAusgeloest({ ...gueltig, website: '   ' })).toBe(false)
  })
})

describe('alsAnfrage', () => {
  it('schneidet umgebende Leerzeichen ab', () => {
    const anfrage = alsAnfrage({ ...gueltig, name: '  Sven  ', email: ' a@b.de ' })

    expect(anfrage.name).toBe('Sven')
    expect(anfrage.email).toBe('a@b.de')
  })
})
