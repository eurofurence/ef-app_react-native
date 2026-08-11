import { captureException } from '@sentry/react-native'
import * as Application from 'expo-application'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Modal, Platform, StyleSheet, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { useCache } from '@/context/data/Cache'
import { useAppConfig } from '@/hooks/data/useAppConfig'
import { useTheme } from '@/hooks/themes/useThemeHooks'
import { compareVersions } from '@/util/compareVersions'

// The App Store listing is keyed by the ascAppId from eas.json, which is not
// exposed at runtime. The Play listing is keyed by the application ID, which is.
const storeUrl = Platform.select({
  ios: 'https://apps.apple.com/app/id1112547322',
  android: `https://play.google.com/store/apps/details?id=${Application.applicationId}`,
  web: undefined,
})

/**
 * Prompts the user to install a newer release when the synced app config
 * advertises one above the installed version. Dismissing is remembered until
 * an even newer release is advertised.
 */
export function UpdateAvailableModal() {
  const { t } = useTranslation('UpdateAvailable')
  const { latestRelease } = useAppConfig()
  const { getValue, setValue } = useCache()
  const theme = useTheme()
  const [closed, setClosed] = useState(false)

  // Null off-device, where there is no store to send anyone to either.
  const currentVersion = Application.nativeApplicationVersion
  const { dismissedRelease } = getValue('settings')

  const visible =
    !closed &&
    storeUrl !== undefined &&
    latestRelease !== undefined &&
    currentVersion !== null &&
    compareVersions(latestRelease, currentVersion) > 0 &&
    (dismissedRelease === undefined ||
      compareVersions(latestRelease, dismissedRelease) > 0)

  const onDismiss = () => {
    setClosed(true)
    setValue('settings', {
      ...getValue('settings'),
      dismissedRelease: latestRelease,
    })
  }

  const onUpdate = () => {
    setClosed(true)
    if (storeUrl) Linking.openURL(storeUrl).catch(captureException)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { backgroundColor: theme.primary }]} />
          <View style={styles.body}>
            <Label type='h3' variant='middle'>
              {t('title')}
            </Label>
            <Label type='regular' style={styles.text}>
              {t('body', { version: latestRelease })}
            </Label>
            <Button icon='update' onPress={onUpdate} style={styles.update}>
              {t('update')}
            </Button>
            <Button outline onPress={onDismiss}>
              {t('dismiss')}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 0, 20, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 18,
    overflow: 'hidden',
  },
  header: {
    height: 12,
  },
  body: {
    padding: 20,
    gap: 12,
  },
  text: {
    marginBottom: 4,
  },
  update: {
    marginTop: 4,
  },
})
