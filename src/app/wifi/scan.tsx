import { CameraView, useCameraPermissions } from 'expo-camera'
import { router } from 'expo-router'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { parseWifiUrl } from '@/components/wifi/wifi.common'

export default function WifiScanScreen() {
  const { t } = useTranslation('WiFi')
  const [permission, requestPermission] = useCameraPermissions()
  const insets = useSafeAreaInsets()
  const handled = useRef(false)

  const onScanned = useCallback(({ data }: { data: string }) => {
    if (handled.current) return
    const parsed = parseWifiUrl(data)
    if (!parsed) return // ignore non-wifi QR codes
    handled.current = true
    const params =
      parsed.profile === 'custom'
        ? { id: parsed.identity, pw: parsed.password }
        : { profile: parsed.profile }
    router.replace({ pathname: '/wifi', params })
  }, [])

  if (!permission) return <View />

  return (
    <>
      {permission.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={onScanned}
        />
      ) : (
        <View style={styles.center}>
          <Label type='para' className='mb-4'>
            {t('camera_permission')}
          </Label>
          <Button icon='camera' onPress={requestPermission}>
            {t('grant_camera')}
          </Button>
        </View>
      )}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 8 }]}>
        <Button
          style={styles.back}
          icon='arrow-left'
          onPress={() => router.replace({ pathname: '/wifi' })}
        >
          {t('confirm_cancel')}
        </Button>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 8,
    width: '100%',
  },
  back: {
    width: '100%',
  },
})
