import { describe, expect, it } from 'bun:test'

import { redactSensitiveUrl } from '@/util/redactSensitiveUrl'

describe('redactSensitiveUrl', () => {
  it('redacts id, pw and token query params', () => {
    expect(
      redactSensitiveUrl(
        'https://x/WiFi/profile.mobileconfig?profile=event&token=abc'
      )
    ).toBe('https://x/WiFi/profile.mobileconfig?profile=event&token=REDACTED')
    expect(redactSensitiveUrl('eurofurence://wifi?id=greeny&pw=secret')).toBe(
      'eurofurence://wifi?id=REDACTED&pw=REDACTED'
    )
  })
  it('passes through urls with nothing sensitive', () => {
    expect(redactSensitiveUrl('https://x/y?profile=event')).toBe(
      'https://x/y?profile=event'
    )
  })
  it('returns non-strings unchanged', () => {
    expect(redactSensitiveUrl(null)).toBeNull()
    expect(redactSensitiveUrl(42)).toBe(42)
  })
})
