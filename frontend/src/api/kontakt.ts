/**
 * Client für die Kontakt-API. Die relative Adresse funktioniert in
 * der Entwicklung (Vite-Proxy, siehe vite.config.ts) und in Produktion
 * (Caddy leitet /api an das Backend) ohne Umgebungsunterscheidung.
 */

/** Muss zum DTO KontaktRequest des Backends passen. */
export type KontaktAnfrage = {
  name: string
  email: string
  nachricht: string
  datenschutz: boolean
  /** Honeypot: Menschen lassen das Feld leer. */
  website: string
}

/** Fehlerantwort der API (ProblemDetail nach RFC 9457). */
export class KontaktApiFehler extends Error {
  readonly status: number
  /** Meldung je Formularfeld bei Validierungsfehlern (Status 400). */
  readonly felder: Record<string, string>

  constructor(status: number, detail?: string, felder?: Record<string, string>) {
    super(detail ?? `Kontakt-API antwortete mit Status ${status}`)
    this.name = 'KontaktApiFehler'
    this.status = status
    this.felder = felder ?? {}
  }
}

export async function sendeKontaktanfrage(anfrage: KontaktAnfrage): Promise<void> {
  const response = await fetch('/api/kontakt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anfrage),
  })
  if (response.ok) return

  const problem = await response.json().catch(() => null)
  throw new KontaktApiFehler(response.status, problem?.detail, problem?.felder)
}
