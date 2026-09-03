import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from './kontakt'
import { sendeKontaktmail } from './_lib/mail'
import { LIMIT } from './_lib/rate-limiter'

vi.mock('./_lib/mail', () => ({ sendeKontaktmail: vi.fn() }))

const versand = vi.mocked(sendeKontaktmail)

const gueltig = {
  name: 'Sven Leitermann',
  email: 'kunde@example.de',
  nachricht: 'Ich brauche einen Leitungsgraben von etwa 20 Metern.',
  datenschutz: true,
  website: '',
}

function anfrage(koerper: unknown, adresse: string, methode = 'POST'): VercelRequest {
  return {
    method: methode,
    body: koerper,
    headers: { 'x-forwarded-for': adresse },
    socket: { remoteAddress: adresse },
  } as unknown as VercelRequest
}

function antwort() {
  const ergebnis = { status: 0, koerper: '', header: {} as Record<string, string> }
  const response = {
    setHeader(name: string, wert: string) {
      ergebnis.header[name] = wert
      return response
    },
    status(code: number) {
      ergebnis.status = code
      return response
    },
    send(inhalt: string) {
      ergebnis.koerper = inhalt
      return response
    },
    end() {
      return response
    },
  }
  return { response: response as unknown as VercelResponse, ergebnis }
}

describe('POST /api/kontakt', () => {
  beforeEach(() => versand.mockReset())

  it('versendet eine gültige Anfrage und beantwortet sie mit 200', async () => {
    const { response, ergebnis } = antwort()

    await handler(anfrage(gueltig, '198.51.100.1'), response)

    expect(ergebnis.status).toBe(200)
    expect(versand).toHaveBeenCalledOnce()
    expect(versand.mock.calls[0]?.[0].email).toBe('kunde@example.de')
  })

  it('lehnt andere Methoden als POST ab', async () => {
    const { response, ergebnis } = antwort()

    await handler(anfrage(gueltig, '198.51.100.2', 'GET'), response)

    expect(ergebnis.status).toBe(405)
    expect(ergebnis.header.Allow).toBe('POST')
    expect(versand).not.toHaveBeenCalled()
  })

  it('meldet Validierungsfehler je Feld mit 400', async () => {
    const { response, ergebnis } = antwort()

    await handler(anfrage({ ...gueltig, email: 'kaputt' }, '198.51.100.3'), response)

    expect(ergebnis.status).toBe(400)
    expect(ergebnis.header['Content-Type']).toContain('application/problem+json')
    const problem = JSON.parse(ergebnis.koerper)
    expect(problem.felder.email).toBe('Bitte geben Sie eine gültige E-Mail-Adresse an.')
    expect(versand).not.toHaveBeenCalled()
  })

  it('verwirft eine Anfrage mit gefülltem Honeypot still', async () => {
    const { response, ergebnis } = antwort()

    await handler(anfrage({ ...gueltig, website: 'spam' }, '198.51.100.4'), response)

    expect(ergebnis.status).toBe(200)
    expect(versand).not.toHaveBeenCalled()
  })

  it('antwortet über dem Limit mit 429', async () => {
    for (let versuch = 1; versuch <= LIMIT; versuch++) {
      const { response } = antwort()
      await handler(anfrage(gueltig, '198.51.100.5'), response)
    }

    const { response, ergebnis } = antwort()
    await handler(anfrage(gueltig, '198.51.100.5'), response)

    expect(ergebnis.status).toBe(429)
    expect(versand).toHaveBeenCalledTimes(LIMIT)
  })

  it('meldet einen Versandfehler mit 503', async () => {
    versand.mockRejectedValueOnce(new Error('SMTP nicht erreichbar'))
    const { response, ergebnis } = antwort()

    await handler(anfrage(gueltig, '198.51.100.6'), response)

    expect(ergebnis.status).toBe(503)
    expect(JSON.parse(ergebnis.koerper).title).toBe('Versand derzeit nicht möglich')
  })

  it('lehnt einen unlesbaren Rumpf mit 400 ab', async () => {
    const { response, ergebnis } = antwort()

    await handler(anfrage('{kein json', '198.51.100.7'), response)

    expect(ergebnis.status).toBe(400)
    expect(versand).not.toHaveBeenCalled()
  })
})
