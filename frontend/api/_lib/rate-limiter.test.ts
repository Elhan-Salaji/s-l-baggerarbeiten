import { describe, expect, it } from 'vitest'
import { LIMIT, FENSTER_MS, RateLimiter } from './rate-limiter.js'

/** Steuerbare Uhr, damit die Tests kein Zeitfenster abwarten müssen. */
function uhr(start = 0) {
  let jetzt = start
  return {
    lies: () => jetzt,
    spuleVor: (millis: number) => {
      jetzt += millis
    },
  }
}

describe('RateLimiter', () => {
  it('erlaubt Anfragen bis einschließlich des Limits', () => {
    const limiter = new RateLimiter(uhr().lies)

    for (let versuch = 1; versuch <= LIMIT; versuch++) {
      expect(limiter.erlaube('10.0.0.1')).toBe(true)
    }
  })

  it('blockt die Anfrage über dem Limit', () => {
    const limiter = new RateLimiter(uhr().lies)
    for (let versuch = 1; versuch <= LIMIT; versuch++) limiter.erlaube('10.0.0.1')

    expect(limiter.erlaube('10.0.0.1')).toBe(false)
  })

  it('erlaubt wieder nach Ablauf des Fensters', () => {
    const zeit = uhr()
    const limiter = new RateLimiter(zeit.lies)
    for (let versuch = 1; versuch <= LIMIT; versuch++) limiter.erlaube('10.0.0.1')

    zeit.spuleVor(FENSTER_MS + 1)

    expect(limiter.erlaube('10.0.0.1')).toBe(true)
  })

  it('zählt Gegenstellen unabhängig voneinander', () => {
    const limiter = new RateLimiter(uhr().lies)
    for (let versuch = 1; versuch <= LIMIT; versuch++) limiter.erlaube('10.0.0.1')

    expect(limiter.erlaube('10.0.0.2')).toBe(true)
  })
})
