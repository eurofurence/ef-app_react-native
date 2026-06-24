import { NativeModule, requireNativeModule } from 'expo'

declare class ExpoEfwifiModule extends NativeModule<{}> {
  addEnterpriseNetwork(ssid: string, identity: string, password: string, anonymous_identity: string, subject_match: string): number;
}

export default requireNativeModule<ExpoEfwifiModule>('EfWifi');