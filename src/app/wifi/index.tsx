import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { WifiSetup } from '@/components/wifi/WifiSetup'
import { parseWifiUrl } from '@/components/wifi/wifi.common'

export default function WifiScreen() {
  const { t } = useTranslation('WiFi')
  const { id, pw, profile } = useLocalSearchParams<{
    id?: string
    pw?: string
    profile?: string
  }>()

  // Reuse the same secure parser as deeplinks/QR for any inbound params.
  const parsed =
    id != null && pw != null
      ? parseWifiUrl(`x?id=${id}&pw=${pw}`)
      : profile
        ? parseWifiUrl(`x?profile=${profile}`)
        : null

  return (
    <ScrollView style={StyleSheet.absoluteFill}>
      <Header>{t('title')}</Header>
      <Floater containerStyle={appStyles.trailer}>
        <WifiSetup
          initialProfile={parsed?.profile}
          initialIdentity={
            parsed && parsed.profile === 'custom' ? parsed.identity : undefined
          }
          initialPassword={
            parsed && parsed.profile === 'custom' ? parsed.password : undefined
          }
        />
      </Floater>
    </ScrollView>
  )
}
