import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { storageKeyTokenResponse, useAuthContext } from '@/context/auth/Auth'
import { useCache } from '@/context/data/Cache'
import { withAlpha } from '@/context/Theme'
import { useToastContext } from '@/context/ui/ToastContext'
import { useThemeBackground, useThemeColor } from '@/hooks/themes/useThemeHooks'
import { getDevicePushToken } from '@/hooks/tokens/useTokenManager'
import * as SecureStore from '@/util/secureStorage'
import { vibrateAfter } from '@/util/vibrateAfter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { captureException } from '@sentry/react-native'
import { setStringAsync } from 'expo-clipboard'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'

export function DevButtons() {
  const { t } = useTranslation('Settings', { keyPrefix: 'dev_buttons' })
  const { synchronize, clear } = useCache()
  const { toast } = useToastContext()
  const [tokenData, setTokenData] = useState('')
  const { load, accessToken, refreshToken, logout } = useAuthContext()

  const styleLighten = useThemeBackground('inverted')
  const styleText = useThemeColor('invText')

  // Copies the device push token for notifications.
  const copyDevicePushToken = useCallback(async () => {
    try {
      const pushToken = await getDevicePushToken()
      await setStringAsync(pushToken)
      console.log(pushToken ?? '')
      toast('info', 'Device push token copied to clipboard', 5000)
    } catch (error) {
      toast('warning', 'Failed to copy device push token', 5000)
      captureException(error)
    }
  }, [toast])

  // Refreshes the current login state.
  const refreshLoginToken = useCallback(async () => {
    try {
      await refreshToken(true)
      toast('info', 'Login token data refreshed', 5000)
    } catch (error) {
      toast('warning', 'Failed to refresh login token data', 5000)
      captureException(error)
    }
  }, [refreshToken, toast])

  // Logs in with the token data from the text input.
  const loginWithTokenData = useCallback(async () => {
    try {
      await load(JSON.parse(tokenData))
    } catch (error) {
      captureException(error)
    }
  }, [load, tokenData])

  // Copies the token data into the clipboard.
  const copyTokenData = useCallback(async () => {
    try {
      const tokenData = await SecureStore.getItemAsync(storageKeyTokenResponse)
      await setStringAsync(tokenData ?? '')
      console.log(tokenData ?? '')
      toast('info', 'Token data copied to clipboard', 5000)
    } catch (error) {
      toast('warning', 'Failed to copy token data', 5000)
      captureException(error)
    }
  }, [toast])

  // Clears all AsyncStorage data
  const clearAsyncStorage = useCallback(async () => {
    try {
      await AsyncStorage.clear()
      toast('info', 'All AsyncStorage data cleared', 5000)
    } catch (error) {
      toast('warning', 'Failed to clear AsyncStorage data', 5000)
      captureException(error)
    }
  }, [toast])

  // Forces logout and clears browser session
  const forceLogout = useCallback(async () => {
    try {
      await logout()
      toast('info', 'Force logout completed', 5000)
    } catch (error) {
      toast('warning', 'Failed to force logout', 5000)
      captureException(error)
    }
  }, [logout, toast])

  return (
    <View style={styles.container}>
      <Section title={t('title')} subtitle={t('subtitle')} />

      <TextInput
        style={[styles.tokenField, styleLighten, styleText]}
        value={tokenData}
        onChangeText={setTokenData}
        placeholder={t('token_data_placeholder')}
        placeholderTextColor={withAlpha(styleText.color, 0.6)}
      />

      <Button onPress={loginWithTokenData} icon="key-variant">
        {t('set_token_data')}
      </Button>

      <Button disabled={!accessToken} onPress={refreshLoginToken} icon="refresh-circle">
        {t('refresh_login_tokens_and_claims')}
      </Button>

      <Button disabled={!accessToken} onPress={copyTokenData} icon="file-key">
        {t('copy_token_data')}
      </Button>

      <Button onPress={() => vibrateAfter(synchronize())} icon="refresh">
        {t('sync')}
      </Button>

      <Button onPress={() => vibrateAfter(synchronize({ full: true }))} icon="refresh">
        {t('sync_full', 'Force full sync')}
      </Button>

      <Button onPress={() => vibrateAfter(clear())} icon="refresh">
        {t('clear')}
      </Button>

      <Button onPress={copyDevicePushToken} icon="file-key">
        {t('copy_device_push_token')}
      </Button>

      <Button onPress={clearAsyncStorage} icon="delete">
        {t('clear_async_storage')}
      </Button>

      <Button onPress={forceLogout} icon="logout">
        {t('force_logout')}
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  tokenField: {
    borderRadius: 10,
    padding: 10,
  },
})
