import { describe, expect, it } from 'bun:test'

import {
  credentialsForProfile,
  isValidCredential,
  WIFI_ANONYMOUS_IDENTITY,
  WIFI_DOMAIN_SUFFIX_MATCH,
  WIFI_PROFILE_IDS,
  WIFI_PUBLIC_PROFILE_IDS,
  WIFI_SSID,
} from '@/components/wifi/wifi.common'

describe('wifi constants', () => {
  it('pins the EF contract', () => {
    expect(WIFI_SSID).toBe('Eurofurence')
    expect(WIFI_ANONYMOUS_IDENTITY).toBe('anonymous')
    expect(WIFI_DOMAIN_SUFFIX_MATCH).toBe('radius.eurofurence.org')
    expect(WIFI_PROFILE_IDS).toEqual([
      'eurofurence',
      'public',
      'event',
      'custom',
    ])
    expect(WIFI_PUBLIC_PROFILE_IDS).toEqual(['eurofurence', 'public', 'event'])
  })
})

describe('credentialsForProfile', () => {
  it('returns id==pw for fixed public profiles', () => {
    expect(credentialsForProfile('eurofurence')).toEqual({
      identity: 'eurofurence',
      password: 'eurofurence',
    })
    expect(credentialsForProfile('public')).toEqual({
      identity: 'public',
      password: 'public',
    })
    expect(credentialsForProfile('event')).toEqual({
      identity: 'event',
      password: 'event',
    })
  })
  it('returns provided custom credentials when valid', () => {
    expect(
      credentialsForProfile('custom', {
        identity: 'greeny',
        password: 'gr33n!',
      })
    ).toEqual({
      identity: 'greeny',
      password: 'gr33n!',
    })
  })
  it('returns null for custom without valid creds', () => {
    expect(credentialsForProfile('custom')).toBeNull()
    expect(
      credentialsForProfile('custom', { identity: '', password: 'x' })
    ).toBeNull()
  })
})

describe('isValidCredential', () => {
  it('accepts printable ASCII up to 128 chars', () => {
    expect(isValidCredential('eurofurence')).toBe(true)
    expect(isValidCredential('a b c')).toBe(true)
  })
  it('rejects empty, control chars, and overlong values', () => {
    expect(isValidCredential('')).toBe(false)
    expect(isValidCredential('bad\nvalue')).toBe(false)
    expect(isValidCredential('x'.repeat(129))).toBe(false)
  })
  it('accepts exactly 128 chars and rejects 129', () => {
    expect(isValidCredential('x'.repeat(128))).toBe(true)
    expect(isValidCredential('x'.repeat(129))).toBe(false)
  })
})
