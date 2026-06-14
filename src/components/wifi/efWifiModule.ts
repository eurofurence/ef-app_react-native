import { requireNativeModule } from 'expo-modules-core'

export type WifiEnterpriseRequest = {
  ssid: string
  identity: string
  password: string
  anonymousIdentity: string
  domainSuffixMatch: string
}

/**
 * Android only: launch the system "add network" sheet for a WPA2-Enterprise (EAP-TTLS/PAP) network.
 * The native module is resolved lazily so importing this file never throws on iOS/JS.
 */
export async function addEnterpriseNetwork(
  request: WifiEnterpriseRequest
): Promise<void> {
  const EfWifi = requireNativeModule('EfWifi')
  await EfWifi.addEnterpriseNetwork(request)
}
