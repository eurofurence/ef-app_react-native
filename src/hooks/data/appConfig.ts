import type { AppConfigRecord } from '@/context/data/types.api'

const isTrue = (value?: string) => value?.toLowerCase() === 'true'

export type AppConfig = {
  cmaUrl?: string
  mapsUrl?: string
  publicWifiSsid?: string
  walletPassesDisabled: boolean
  wifiConfigDisabled: boolean
}

/**
 * Normalizes the raw synced app config. String feature flags are parsed to
 * booleans; absent flags default to false.
 */
export function normalizeAppConfig(
  appConfig: AppConfigRecord | null
): AppConfig {
  return {
    cmaUrl: appConfig?.CmaUrl,
    mapsUrl: appConfig?.MapsUrl,
    publicWifiSsid: appConfig?.PublicWifiSsid,
    walletPassesDisabled: isTrue(appConfig?.FeatureWalletPassesDisabled),
    wifiConfigDisabled: isTrue(appConfig?.FeatureWifiConfigDisabled),
  }
}
