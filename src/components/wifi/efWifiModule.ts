import { NativeModule, requireOptionalNativeModule } from 'expo'

type EfWifiRequest = {
  ssid: string
  identity: string
  password: string
  anonymousIdentity?: string
  domainSuffixMatch?: string
}

declare class EfWifiNativeModule extends NativeModule<{}> {
  addEnterpriseNetwork(request: EfWifiRequest): Promise<void>
}

const efWifiModule = requireOptionalNativeModule<EfWifiNativeModule>('EfWifi')

// Native module (see EfWifiModule.kt) launches the Android system "add network" dialog on
// API 30+ and throws EfWifiException / MissingActivity on failure rather than returning a code.
export async function addEnterpriseNetwork(
  ssid: string,
  identity: string,
  password: string,
  anonymousIdentity: string,
  domainSuffixMatch: string
): Promise<void> {
  if (!efWifiModule)
    throw new Error('EfWifi native module is not available in this build')
  await efWifiModule.addEnterpriseNetwork({
    ssid,
    identity,
    password,
    anonymousIdentity,
    domainSuffixMatch,
  })
}
