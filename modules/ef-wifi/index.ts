import { requireOptionalNativeModule } from 'expo-modules-core'

// Native module registered as "EfWifi" (see android/ios). App code uses the typed wrapper
// in '@/components/wifi/efWifiModule' instead of importing this entry directly.
export default requireOptionalNativeModule('EfWifi')