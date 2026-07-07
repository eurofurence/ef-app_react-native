import { NativeModule, requireOptionalNativeModule } from 'expo'

declare class ExpoEfWifiModule extends NativeModule<{}> {
  addEnterpriseNetwork(
    ssid: string,
    identity: string,
    password: string,
    anonymousIdentity: string,
    subjectMatch: string
  ): number
}

const efWifiModule = requireOptionalNativeModule<ExpoEfWifiModule>('EfWifi')

// Native return codes, mirrored from ExpoEfWifiModule.kt:
// 0 OK, 1 wifi service unavailable, 2 CA cert unreadable,
// 3 enterprise config rejected, 4 permission denied reading networks (pre-Android 10), 5 apply failed
export function addEnterpriseNetwork(
  ssid: string,
  identity: string,
  password: string,
  anonymousIdentity: string,
  subjectMatch: string
): void {
  if (!efWifiModule)
    throw new Error('EfWifi native module is not available in this build')
  const code = efWifiModule.addEnterpriseNetwork(
    ssid,
    identity,
    password,
    anonymousIdentity,
    subjectMatch
  )
  if (code !== 0)
    throw new Error(`EfWifi.addEnterpriseNetwork failed with code ${code}`)
}
