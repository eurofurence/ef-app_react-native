import { describe, expect, it } from 'bun:test'

import {
  buildOnsiteFileUrl,
  buildOnsiteProfileUrl,
  WIFI_ONSITE_URL,
} from '@/components/wifi/wifi.common'

describe('buildOnsiteProfileUrl', () => {
  it('builds the onsite page URL with id/pw', () => {
    expect(buildOnsiteProfileUrl('event', 'event')).toBe(
      `${WIFI_ONSITE_URL}/?id=event&pw=event`
    )
  })
  it('url-encodes credentials', () => {
    expect(buildOnsiteProfileUrl('a b', 'c&d')).toBe(
      `${WIFI_ONSITE_URL}/?id=a+b&pw=c%26d`
    )
  })
})

describe('buildOnsiteFileUrl', () => {
  it('builds a direct static .mobileconfig URL per public profile', () => {
    expect(buildOnsiteFileUrl('eurofurence')).toBe(
      `${WIFI_ONSITE_URL}/profiles/eurofurence.mobileconfig`
    )
    expect(buildOnsiteFileUrl('public')).toBe(
      `${WIFI_ONSITE_URL}/profiles/public.mobileconfig`
    )
    expect(buildOnsiteFileUrl('event')).toBe(
      `${WIFI_ONSITE_URL}/profiles/event.mobileconfig`
    )
  })
})
