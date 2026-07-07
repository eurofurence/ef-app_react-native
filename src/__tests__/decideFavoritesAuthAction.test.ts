import { describe, expect, test } from 'bun:test'

import { decideFavoritesAuthAction } from '@/components/auth/decideFavoritesAuthAction'

describe('decideFavoritesAuthAction', () => {
  test('merges when starting up already logged in', () => {
    expect(
      decideFavoritesAuthAction(null, {
        isLoggedIn: true,
        sessionExpired: false,
      })
    ).toBe('merge')
  })

  test('merges on sign-in transition', () => {
    expect(
      decideFavoritesAuthAction(
        { isLoggedIn: false },
        { isLoggedIn: true, sessionExpired: false }
      )
    ).toBe('merge')
  })

  test('clears on active sign-out', () => {
    expect(
      decideFavoritesAuthAction(
        { isLoggedIn: true },
        { isLoggedIn: false, sessionExpired: false }
      )
    ).toBe('clear')
  })

  test('does nothing on session expiry (modal handles it)', () => {
    expect(
      decideFavoritesAuthAction(
        { isLoggedIn: true },
        { isLoggedIn: false, sessionExpired: true }
      )
    ).toBe('none')
  })

  test('does nothing when logged-in state is unchanged', () => {
    expect(
      decideFavoritesAuthAction(
        { isLoggedIn: true },
        { isLoggedIn: true, sessionExpired: false }
      )
    ).toBe('none')
  })

  test('does nothing when starting up logged out', () => {
    expect(
      decideFavoritesAuthAction(null, {
        isLoggedIn: false,
        sessionExpired: false,
      })
    ).toBe('none')
  })
})
