import { captureException } from '@sentry/react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as IntentLauncher from 'expo-intent-launcher'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet } from 'react-native'

import { Image } from '@/components/generic/atoms/Image'
import { Pressable } from '@/components/generic/Pressable'
import { apiBase } from '@/configuration'
import { useToastContext } from '@/context/ui/ToastContext'
import { auth } from '@/data/clients/auth'
import { useAppConfig } from '@/hooks/data/useAppConfig'

const pkpassMime = 'application/vnd.apple.pkpass'

// The pkpass works for both wallets; only the official badge art differs by OS.
const isAndroid = Platform.OS === 'android'
const badge = isAndroid
  ? require('@/assets/static/googlewallet.svg')
  : require('@/assets/static/applewallet.svg')
// Aspect ratios taken from the source SVGs so the badge is not distorted.
const badgeAspectRatio = isAndroid ? 199 / 55 : 110.739 / 35.016

export function AddToWalletButton() {
  const { t } = useTranslation('Profile')
  const { toast } = useToastContext()
  const { walletPassesDisabled } = useAppConfig()
  const [busy, setBusy] = useState(false)

  const onPress = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      // The pass endpoint is auth-gated. Exchange the bearer token for a
      // single-use pass token so the pass URL is self-authenticating, then
      // hand it to the wallet per platform below.
      const bearer = auth.state.tokenResponse?.accessToken
      const res = await fetch(`${apiBase}/Users/Pass/:token`, {
        headers: {
          Accept: 'application/json',
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        },
      })
      if (!res.ok) throw new Error(`Pass token request failed (${res.status})`)
      const passToken = String(await res.json())

      const url = `${apiBase}/Users/Pass?mimeType=${encodeURIComponent(pkpassMime)}&token=${encodeURIComponent(passToken)}`

      if (Platform.OS === 'android') {
        // A browser would just download the file; save it ourselves and fire a
        // VIEW intent so Google Wallet's "Add pass" screen handles it instead.
        const target = `${FileSystem.cacheDirectory}convention-pass.pkpass`
        await FileSystem.downloadAsync(url, target)
        const contentUri = await FileSystem.getContentUriAsync(target)
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          type: pkpassMime,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        })
      } else {
        // iOS recognises the pkpass response and shows the Add to Wallet sheet.
        await Linking.openURL(url)
      }
    } catch (error) {
      captureException(error)
      toast('error', t('wallet_failed'), 6000)
    } finally {
      setBusy(false)
    }
  }, [busy, t, toast])

  // Wallet passes are an Apple/Google feature - hide elsewhere (web, desktop).
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return null
  if (walletPassesDisabled) return null

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      containerStyle={[styles.button, busy && styles.busy]}
      accessibilityRole='button'
      accessibilityLabel={t('add_to_wallet')}
    >
      <Image
        source={badge}
        style={[styles.badge, { aspectRatio: badgeAspectRatio }]}
        contentFit='contain'
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  busy: {
    opacity: 0.5,
  },
  badge: {
    height: 48,
  },
})
