/**
 * Begrenzt Kontaktanfragen je Absender-Adresse auf ein festes
 * Stundenfenster. Der Zustand lebt im Speicher der Serverless-Instanz:
 * Vercel hält eine Instanz zwischen Anfragen eine Weile warm, startet
 * unter Last aber weitere daneben. Mehrere Instanzen zählen getrennt,
 * ein Kaltstart setzt den Zähler zurück (siehe ADR 0006).
 */

export const LIMIT = 5
export const FENSTER_MS = 60 * 60 * 1000

type Fenster = {
  start: number
  anzahl: number
}

export class RateLimiter {
  readonly #fenster = new Map<string, Fenster>()
  readonly #jetzt: () => number

  /** @param jetzt Zeitquelle, im Test durch eine steuerbare Uhr ersetzbar. */
  constructor(jetzt: () => number = Date.now) {
    this.#jetzt = jetzt
  }

  /** Meldet, ob eine weitere Anfrage dieser Gegenstelle noch ins Fenster passt. */
  erlaube(schluessel: string): boolean {
    const jetzt = this.#jetzt()

    // Abgelaufene Fenster bei der Gelegenheit ausräumen, die Map bleibt klein.
    for (const [key, fenster] of this.#fenster) {
      if (this.#istAbgelaufen(fenster, jetzt)) {
        this.#fenster.delete(key)
      }
    }

    const vorhanden = this.#fenster.get(schluessel)
    const fenster = vorhanden ?? { start: jetzt, anzahl: 0 }
    this.#fenster.set(schluessel, fenster)

    fenster.anzahl += 1
    return fenster.anzahl <= LIMIT
  }

  #istAbgelaufen(fenster: Fenster, jetzt: number): boolean {
    return fenster.start + FENSTER_MS < jetzt
  }
}
