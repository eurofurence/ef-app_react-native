import { describe, expect, it } from 'bun:test'

import { authKeyOf, decideSyncMode } from '@/context/data/decideSyncMode'

const current = { cid: 'EF30', cacheVersion: 1, authKey: '' }
const cached = {
  lastSynchronised: '2026-07-20T10:00:00Z',
  cid: 'EF30',
  cacheVersion: 1,
  lastSyncAuthKey: '',
}

describe('authKeyOf', () => {
  it('is stable while signed out', () => {
    expect(authKeyOf(null, null)).toBe('/')
  })

  it('changes when signing in', () => {
    expect(authKeyOf({ sub: 'u1' }, { Roles: ['Attendee'] })).not.toBe(
      authKeyOf(null, null)
    )
  })

  it('changes when a role is granted to the same subject', () => {
    expect(authKeyOf({ sub: 'u1' }, { Roles: ['Attendee'] })).not.toBe(
      authKeyOf({ sub: 'u1' }, { Roles: ['Attendee', 'Staff'] })
    )
  })
})

describe('decideSyncMode', () => {
  it('deltas when nothing changed', () => {
    expect(decideSyncMode({}, cached, current)).toBe('delta')
  })

  it('fulls when explicitly forced', () => {
    expect(decideSyncMode({ full: true }, cached, current)).toBe('full')
  })

  it('fulls on signing in, so internal events are fetched', () => {
    const signedOut = authKeyOf(null, null)
    const signedIn = authKeyOf({ sub: 'u1' }, { Roles: ['Attendee', 'Staff'] })

    expect(
      decideSyncMode(
        {},
        { ...cached, lastSyncAuthKey: signedOut },
        { ...current, authKey: signedIn }
      )
    ).toBe('full')
  })

  it('fulls on signing out, so internal events are dropped', () => {
    const signedIn = authKeyOf({ sub: 'u1' }, { Roles: ['Staff'] })
    const signedOut = authKeyOf(null, null)

    expect(
      decideSyncMode(
        {},
        { ...cached, lastSyncAuthKey: signedIn },
        { ...current, authKey: signedOut }
      )
    ).toBe('full')
  })

  it('fulls when a role is granted without the token changing', () => {
    expect(
      decideSyncMode(
        {},
        { ...cached, lastSyncAuthKey: authKeyOf({ sub: 'u1' }, { Roles: [] }) },
        {
          ...current,
          authKey: authKeyOf({ sub: 'u1' }, { Roles: ['Staff'] }),
        }
      )
    ).toBe('full')
  })

  it('fulls when the account changed', () => {
    expect(
      decideSyncMode(
        {},
        { ...cached, lastSyncAuthKey: authKeyOf({ sub: 'u1' }, null) },
        { ...current, authKey: authKeyOf({ sub: 'u2' }, null) }
      )
    ).toBe('full')
  })

  it('fulls on a convention or cache format change', () => {
    expect(decideSyncMode({}, { ...cached, cid: 'EF29' }, current)).toBe('full')
    expect(decideSyncMode({}, { ...cached, cacheVersion: 0 }, current)).toBe(
      'full'
    )
  })

  it('fulls without a baseline', () => {
    expect(
      decideSyncMode({}, { ...cached, lastSynchronised: '' }, current)
    ).toBe('full')
  })
})
