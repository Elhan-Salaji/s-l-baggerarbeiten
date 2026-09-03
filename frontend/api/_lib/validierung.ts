/**
 * Prüft Kontaktanfragen, bevor sie weiterverarbeitet werden. Regeln und
 * Meldungen entsprechen der Bean Validation des abgelösten Spring-Backends,
 * damit das Formular unverändert dieselben Feldmeldungen anzeigt.
 */

/** Eine geprüfte Anfrage aus dem Kontaktformular. */
export type KontaktAnfrage = {
  name: string
  email: string
  nachricht: string
  datenschutz: boolean
  /** Honeypot: Menschen lassen das Feld leer. */
  website: string
}

/** Meldung je Formularfeld. Leer bedeutet: Die Anfrage ist gültig. */
export type Feldmeldungen = Record<string, string>

const NAME_MAX = 100
const EMAIL_MAX = 200
const NACHRICHT_MIN = 10
const NACHRICHT_MAX = 5000

// Verlangt einen Punkt in der Domain und ist damit etwas strenger als
// die Vorgängerprüfung. Tippfehler wie "name@gmailcom" fallen dadurch
// auf, bevor eine unzustellbare Antwortadresse im Postfach landet.
const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(wert: unknown): string | null {
  return typeof wert === 'string' ? wert : null
}

function istLeer(wert: unknown): boolean {
  const inhalt = text(wert)
  return inhalt === null || inhalt.trim().length === 0
}

/** Sammelt alle Verstöße der Anfrage, je Feld die erste zutreffende Meldung. */
export function pruefeAnfrage(daten: unknown): Feldmeldungen {
  const anfrage = (daten ?? {}) as Record<string, unknown>
  const meldungen: Feldmeldungen = {}

  const name = text(anfrage.name) ?? ''
  if (istLeer(anfrage.name)) {
    meldungen.name = 'Bitte geben Sie Ihren Namen an.'
  } else if (name.length > NAME_MAX) {
    meldungen.name = `Der Name darf höchstens ${NAME_MAX} Zeichen lang sein.`
  }

  const email = text(anfrage.email) ?? ''
  if (istLeer(anfrage.email)) {
    meldungen.email = 'Bitte geben Sie Ihre E-Mail-Adresse an.'
  } else if (!EMAIL_MUSTER.test(email)) {
    meldungen.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
  } else if (email.length > EMAIL_MAX) {
    meldungen.email = `Die E-Mail-Adresse darf höchstens ${EMAIL_MAX} Zeichen lang sein.`
  }

  const nachricht = text(anfrage.nachricht) ?? ''
  if (istLeer(anfrage.nachricht)) {
    meldungen.nachricht = 'Bitte geben Sie eine Nachricht ein.'
  } else if (nachricht.length < NACHRICHT_MIN || nachricht.length > NACHRICHT_MAX) {
    meldungen.nachricht =
      `Die Nachricht muss zwischen ${NACHRICHT_MIN} und ${NACHRICHT_MAX} Zeichen lang sein.`
  }

  if (anfrage.datenschutz !== true) {
    meldungen.datenschutz = 'Bitte stimmen Sie der Datenschutzerklärung zu.'
  }

  return meldungen
}

/** Meldet, ob das Honeypot-Feld gefüllt wurde und die Anfrage von einem Bot stammt. */
export function istHoneypotAusgeloest(daten: unknown): boolean {
  const anfrage = (daten ?? {}) as Record<string, unknown>
  return !istLeer(anfrage.website)
}

/** Formt geprüfte Daten in die Anfrage um, die der Mailversand erwartet. */
export function alsAnfrage(daten: unknown): KontaktAnfrage {
  const anfrage = (daten ?? {}) as Record<string, unknown>
  return {
    name: (text(anfrage.name) ?? '').trim(),
    email: (text(anfrage.email) ?? '').trim(),
    nachricht: (text(anfrage.nachricht) ?? '').trim(),
    datenschutz: anfrage.datenschutz === true,
    website: text(anfrage.website) ?? '',
  }
}
