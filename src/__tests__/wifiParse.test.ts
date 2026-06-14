import { describe, expect, it } from 'bun:test'

import { parseWifiUrl } from '@/components/wifi/wifi.common'

describe('parseWifiUrl', () => {
  it('parses id/pw from the /connect path', () => {
    expect(
      parseWifiUrl(
        'https://wifi.onsite.eurofurence.org/connect?id=greeny&pw=gr33n!'
      )
    ).toEqual({
      profile: 'custom',
      identity: 'greeny',
      password: 'gr33n!',
    })
  })
  it('parses id/pw from the root path', () => {
    expect(
      parseWifiUrl('https://wifi.onsite.eurofurence.org/?id=a&pw=b')
    ).toEqual({
      profile: 'custom',
      identity: 'a',
      password: 'b',
    })
  })
  it('parses id/pw from an eventwifi:// link', () => {
    expect(parseWifiUrl('eventwifi://connect?id=a&pw=b')).toEqual({
      profile: 'custom',
      identity: 'a',
      password: 'b',
    })
  })
  it('selects a public profile when no creds are given', () => {
    expect(
      parseWifiUrl('https://wifi.onsite.eurofurence.org/connect?profile=event')
    ).toEqual({
      profile: 'event',
    })
  })
  it('ignores attempts to override security-critical config', () => {
    expect(parseWifiUrl('eventwifi://x?id=a&pw=b&ssid=Evil&eap=NONE')).toEqual({
      profile: 'custom',
      identity: 'a',
      password: 'b',
    })
  })
  it('returns null for missing params, junk, and injection payloads', () => {
    expect(parseWifiUrl('https://wifi.onsite.eurofurence.org/')).toBeNull()
    expect(parseWifiUrl('not a url')).toBeNull()
    expect(parseWifiUrl('eventwifi://x?id=ok&pw=bad%0Avalue')).toBeNull()
    expect(parseWifiUrl(`x?id=${'a'.repeat(200)}&pw=b`)).toBeNull()
    expect(parseWifiUrl('x?profile=staff')).toBeNull()
  })
  it('strips a URL fragment from the last param', () => {
    expect(parseWifiUrl('eventwifi://x?id=a&pw=realpass#section')).toEqual({
      profile: 'custom',
      identity: 'a',
      password: 'realpass',
    })
  })
  it('returns null when only one of id/pw is present', () => {
    expect(parseWifiUrl('eventwifi://x?id=only')).toBeNull()
    expect(parseWifiUrl('eventwifi://x?pw=only')).toBeNull()
  })
})
