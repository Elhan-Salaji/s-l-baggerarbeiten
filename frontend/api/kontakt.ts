import type { VercelRequest, VercelResponse } from '@vercel/node'
import { RateLimiter } from './_lib/rate-limiter'
import { sendeKontaktmail } from './_lib/mail'
import { alsAnfrage, istHoneypotAusgeloest, pruefeAnfrage } from './_lib/validierung'
import type { Feldmeldungen } from './_lib/validierung'

/**
 * Nimmt Kontaktanfragen der Webseite entgegen. Der Aufruf ist synchron:
 * Die Antwort sagt ehrlich, ob die Nachricht den Betreiber erreicht.
 *
 * Fehler kommen als ProblemDetail nach RFC 9457 zurück, mit deutschen
 * Meldungen, die das Formular den Besuchern direkt anzeigt.
 */

// Lebt über einzelne Aufrufe hinweg, solange Vercel die Instanz warm hält.
const rateLimiter = new RateLimiter()

function problem(
  response: VercelResponse,
  status: number,
  title: string,
  detail: string,
  felder?: Feldmeldungen,
): void {
  response.setHeader('Content-Type', 'application/problem+json; charset=utf-8')
  response.status(status).send(
    JSON.stringify({ type: 'about:blank', title, status, detail, ...(felder ? { felder } : {}) }),
  )
}

/** Liest den Rumpf, den Vercel je nach Content-Type schon geparst hat. */
function leseKoerper(request: VercelRequest): unknown {
  if (typeof request.body !== 'string') {
    return request.body
  }
  try {
    return JSON.parse(request.body)
  } catch {
    return null
  }
}

/** Die Adresse der Gegenstelle, wie Vercels Proxy sie durchreicht. */
function clientAdresse(request: VercelRequest): string {
  const weitergeleitet = request.headers['x-forwarded-for']
  const kette = Array.isArray(weitergeleitet) ? weitergeleitet[0] : weitergeleitet
  const erste = kette?.split(',')[0]?.trim()
  return erste || request.socket.remoteAddress || 'unbekannt'
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).end()
    return
  }

  const daten = leseKoerper(request)
  if (daten === null || typeof daten !== 'object') {
    problem(response, 400, 'Ungültige Anfrage', 'Bitte prüfen Sie Ihre Eingaben.')
    return
  }

  const felder = pruefeAnfrage(daten)
  if (Object.keys(felder).length > 0) {
    problem(response, 400, 'Ungültige Anfrage', 'Bitte prüfen Sie Ihre Eingaben.', felder)
    return
  }

  if (!rateLimiter.erlaube(clientAdresse(request))) {
    response.status(429).end()
    return
  }

  // Bots bekommen dieselbe Antwort wie Menschen und lernen nichts.
  if (istHoneypotAusgeloest(daten)) {
    console.info('Honeypot ausgelöst, Anfrage still verworfen')
    response.status(200).end()
    return
  }

  try {
    await sendeKontaktmail(alsAnfrage(daten))
  } catch (fehler) {
    console.error('Mailversand fehlgeschlagen', fehler)
    problem(
      response,
      503,
      'Versand derzeit nicht möglich',
      'Ihre Nachricht konnte gerade nicht übermittelt werden. '
        + 'Bitte versuchen Sie es später erneut oder rufen Sie direkt an.',
    )
    return
  }

  response.status(200).end()
}
