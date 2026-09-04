import nodemailer from 'nodemailer'
import type { KontaktAnfrage } from './validierung.js'

/**
 * Verschickt Kontaktanfragen als E-Mail an den Betreiber. Der Versand
 * läuft synchron in der Anfrage mit knappen SMTP-Timeouts: Die Absender
 * bekommen so eine ehrliche Rückmeldung, ob ihre Nachricht angekommen ist.
 */

// Absender und Empfänger stehen ohnehin öffentlich auf der Seite und
// ändern sich selten. Sie hier festzuhalten spart zwei Einträge in der
// Hosting-Konfiguration; MAIL_FROM und MAIL_RECIPIENT überschreiben sie,
// falls der Versand kurzfristig woanders hin soll.
const STANDARD_ABSENDER = 'info@s-l-baggerarbeiten.de'
const STANDARD_EMPFAENGER = 'info@s-l-baggerarbeiten.de, s.l.baggerarbeiten@web.de'

/** Fehlt eine Zugangsvariable, ist die Funktion falsch konfiguriert. */
export class MailKonfigurationFehlt extends Error {
  constructor(name: string) {
    super(`Umgebungsvariable ${name} ist nicht gesetzt`)
    this.name = 'MailKonfigurationFehlt'
  }
}

/** Liest eine Einstellung, die eine sinnvolle Vorgabe hat. */
function wert(name: string, vorgabe: string): string {
  const gesetzt = process.env[name]
  return gesetzt !== undefined && gesetzt.trim() !== '' ? gesetzt : vorgabe
}

/**
 * Zerlegt die Empfängerliste. Mehrere Adressen sind durch Komma
 * getrennt, damit jede Anfrage in beiden Postfächern landet.
 */
function empfaenger(): string[] {
  const adressen = wert('MAIL_RECIPIENT', STANDARD_EMPFAENGER)
    .split(',')
    .map((adresse) => adresse.trim())
    .filter((adresse) => adresse !== '')

  if (adressen.length === 0) {
    throw new MailKonfigurationFehlt('MAIL_RECIPIENT')
  }
  return adressen
}

function pflichtwert(name: string): string {
  const gesetzt = process.env[name]
  if (gesetzt === undefined || gesetzt.trim() === '') {
    throw new MailKonfigurationFehlt(name)
  }
  return gesetzt
}

export async function sendeKontaktmail(anfrage: KontaktAnfrage): Promise<void> {
  const port = Number(process.env.SMTP_PORT ?? '587')

  const transport = nodemailer.createTransport({
    host: pflichtwert('SMTP_HOST'),
    port,
    // Port 465 spricht von der ersten Zeile an TLS, 587 rüstet per
    // STARTTLS nach. requireTLS erzwingt die Umstellung.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: pflichtwert('SMTP_USERNAME'),
      pass: pflichtwert('SMTP_PASSWORD'),
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  })

  // Die Adresse aus dem Formular steht bewusst nur im Reply-To. Als
  // Absender würde sie an SPF und DKIM des Mailkontos scheitern.
  await transport.sendMail({
    to: empfaenger(),
    from: wert('MAIL_FROM', STANDARD_ABSENDER),
    replyTo: anfrage.email,
    subject: `Neue Kontaktanfrage von ${anfrage.name}`,
    text: [
      'Neue Anfrage über das Kontaktformular der Webseite.',
      '',
      `Name: ${anfrage.name}`,
      `E-Mail: ${anfrage.email}`,
      '',
      'Nachricht:',
      anfrage.nachricht,
      '',
    ].join('\n'),
  })
}
