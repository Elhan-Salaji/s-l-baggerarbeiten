import nodemailer from 'nodemailer'
import type { KontaktAnfrage } from './validierung'

/**
 * Verschickt Kontaktanfragen als E-Mail an den Betreiber. Der Versand
 * läuft synchron in der Anfrage mit knappen SMTP-Timeouts: Die Absender
 * bekommen so eine ehrliche Rückmeldung, ob ihre Nachricht angekommen ist.
 */

/** Fehlt eine Zugangsvariable, ist die Funktion falsch konfiguriert. */
export class MailKonfigurationFehlt extends Error {
  constructor(name: string) {
    super(`Umgebungsvariable ${name} ist nicht gesetzt`)
    this.name = 'MailKonfigurationFehlt'
  }
}

/**
 * Zerlegt die Empfängerliste. Mehrere Adressen stehen in MAIL_RECIPIENT
 * durch Komma getrennt, damit jede Anfrage in beiden Postfächern landet.
 */
function empfaenger(): string[] {
  const adressen = pflichtwert('MAIL_RECIPIENT')
    .split(',')
    .map((adresse) => adresse.trim())
    .filter((adresse) => adresse !== '')

  if (adressen.length === 0) {
    throw new MailKonfigurationFehlt('MAIL_RECIPIENT')
  }
  return adressen
}

function pflichtwert(name: string): string {
  const wert = process.env[name]
  if (wert === undefined || wert.trim() === '') {
    throw new MailKonfigurationFehlt(name)
  }
  return wert
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
    from: pflichtwert('MAIL_FROM'),
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
