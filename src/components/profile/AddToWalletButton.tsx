import { captureException } from '@sentry/react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

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
      if (!(await Sharing.isAvailableAsync())) {
        toast('error', t('wallet_unavailable'), 6000)
        return
      }

      // The endpoint is auth-gated, so fetch the file with the token attached
      // rather than opening the URL; the OS handoff still needs a real file.
      const token = auth.state.tokenResponse?.accessToken
      const target = `${FileSystem.cacheDirectory}convention-pass.pkpass`
      const { status, uri } = await FileSystem.downloadAsync(
        `${apiBase}/Users/Pass?mimeType=${encodeURIComponent(pkpassMime)}`,
        target,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      )
      if (status !== 200) throw new Error(`Pass download failed (${status})`)

      await Sharing.shareAsync(uri, {
        mimeType: pkpassMime,
        UTI: 'com.apple.pkpass',
        dialogTitle: t('add_to_wallet'),
      })
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
