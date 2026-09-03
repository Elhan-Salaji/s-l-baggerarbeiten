import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import nodemailer from 'nodemailer'
import { MailKonfigurationFehlt, sendeKontaktmail } from './mail'

const sendMail = vi.fn()

vi.mock('nodemailer', () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}))

const anfrage = {
  name: 'Sven Leitermann',
  email: 'kunde@example.de',
  nachricht: 'Ich brauche einen Leitungsgraben von etwa 20 Metern.',
  datenschutz: true,
  website: '',
}

const zugang = {
  SMTP_HOST: 'smtp.example.de',
  SMTP_PORT: '587',
  SMTP_USERNAME: 'info@s-l-baggerarbeiten.de',
  SMTP_PASSWORD: 'geheim',
  MAIL_FROM: 'info@s-l-baggerarbeiten.de',
  MAIL_RECIPIENT: 'info@s-l-baggerarbeiten.de, s.l.baggerarbeiten@web.de',
}

describe('sendeKontaktmail', () => {
  beforeEach(() => {
    sendMail.mockReset()
    vi.mocked(nodemailer.createTransport).mockClear()
    for (const [name, wert] of Object.entries(zugang)) vi.stubEnv(name, wert)
  })

  afterEach(() => vi.unstubAllEnvs())

  it('versendet mit den Adressen aus der Konfiguration und Antwort an den Absender', async () => {
    await sendeKontaktmail(anfrage)

    expect(sendMail).toHaveBeenCalledOnce()
    const mail = sendMail.mock.calls[0]?.[0]
    expect(mail.to).toEqual(['info@s-l-baggerarbeiten.de', 's.l.baggerarbeiten@web.de'])
    expect(mail.from).toBe('info@s-l-baggerarbeiten.de')
    expect(mail.replyTo).toBe('kunde@example.de')
    expect(mail.subject).toBe('Neue Kontaktanfrage von Sven Leitermann')
    expect(mail.text).toContain('Name: Sven Leitermann')
    expect(mail.text).toContain('E-Mail: kunde@example.de')
    expect(mail.text).toContain('Ich brauche einen Leitungsgraben von etwa 20 Metern.')
  })

  it('schickt an eine einzelne Adresse, wenn nur eine hinterlegt ist', async () => {
    vi.stubEnv('MAIL_RECIPIENT', 'info@s-l-baggerarbeiten.de')

    await sendeKontaktmail(anfrage)

    expect(sendMail.mock.calls[0]?.[0].to).toEqual(['info@s-l-baggerarbeiten.de'])
  })

  it('übergeht Leerzeichen und leere Einträge in der Empfängerliste', async () => {
    vi.stubEnv('MAIL_RECIPIENT', '  info@s-l-baggerarbeiten.de ,, s.l.baggerarbeiten@web.de ,')

    await sendeKontaktmail(anfrage)

    expect(sendMail.mock.calls[0]?.[0].to).toEqual([
      'info@s-l-baggerarbeiten.de',
      's.l.baggerarbeiten@web.de',
    ])
  })

  it('nimmt ohne gesetzte Variablen die Adressen aus dem Code', async () => {
    vi.stubEnv('MAIL_RECIPIENT', '')
    vi.stubEnv('MAIL_FROM', '')

    await sendeKontaktmail(anfrage)

    const mail = sendMail.mock.calls[0]?.[0]
    expect(mail.from).toBe('info@s-l-baggerarbeiten.de')
    expect(mail.to).toEqual(['info@s-l-baggerarbeiten.de', 's.l.baggerarbeiten@web.de'])
  })

  it('rüstet auf Port 587 per STARTTLS nach', async () => {
    await sendeKontaktmail(anfrage)

    const optionen = vi.mocked(nodemailer.createTransport).mock.calls[0]?.[0] as
      Record<string, unknown>
    expect(optionen.secure).toBe(false)
    expect(optionen.requireTLS).toBe(true)
  })

  it('spricht auf Port 465 von Anfang an TLS', async () => {
    vi.stubEnv('SMTP_PORT', '465')

    await sendeKontaktmail(anfrage)

    const optionen = vi.mocked(nodemailer.createTransport).mock.calls[0]?.[0] as
      Record<string, unknown>
    expect(optionen.secure).toBe(true)
    expect(optionen.requireTLS).toBe(false)
  })

  it('meldet eine fehlende Zugangsvariable, statt stillschweigend zu scheitern', async () => {
    vi.stubEnv('SMTP_PASSWORD', '')

    await expect(sendeKontaktmail(anfrage)).rejects.toBeInstanceOf(MailKonfigurationFehlt)
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('lädt nodemailer tatsächlich als Standard-Import', async () => {
    const modul = await vi.importActual<Record<string, unknown>>('nodemailer')
    const standard = (modul.default ?? modul) as { createTransport?: unknown }

    expect(typeof standard.createTransport).toBe('function')
  })
})
