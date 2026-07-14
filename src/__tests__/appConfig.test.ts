import { describe, expect, it } from 'bun:test'
import { normalizeAppConfig } from '@/hooks/data/appConfig'

describe('normalizeAppConfig', () => {
  it('parses the backend example', () => {
    expect(
      normalizeAppConfig({
        CmaUrl: 'https://fursuit.eurofurence.org/catch-em-all',
        FeatureWalletPassesDisabled: 'True',
        MapsUrl: 'https://nav.eurofurence.org/',
      })
    ).toEqual({
      cmaUrl: 'https://fursuit.eurofurence.org/catch-em-all',
      mapsUrl: 'https://nav.eurofurence.org/',
      walletPassesDisabled: true,
      wifiConfigDisabled: false,
    })
  })

  it('parses flags case-insensitively', () => {
    expect(
      normalizeAppConfig({ FeatureWifiConfigDisabled: 'true' })
        .wifiConfigDisabled
    ).toBe(true)
    expect(
      normalizeAppConfig({ FeatureWifiConfigDisabled: 'TRUE' })
        .wifiConfigDisabled
    ).toBe(true)
    expect(
      normalizeAppConfig({ FeatureWifiConfigDisabled: 'False' })
        .wifiConfigDisabled
    ).toBe(false)
    expect(
      normalizeAppConfig({ FeatureWifiConfigDisabled: '' }).wifiConfigDisabled
    ).toBe(false)
  })

  it('defaults flags to false and urls to undefined when absent', () => {
    expect(normalizeAppConfig(null)).toEqual({
      cmaUrl: undefined,
      mapsUrl: undefined,
      walletPassesDisabled: false,
      wifiConfigDisabled: false,
    })
    expect(normalizeAppConfig({})).toEqual({
      cmaUrl: undefined,
      mapsUrl: undefined,
      walletPassesDisabled: false,
      wifiConfigDisabled: false,
    })
  })
})
