import { captureException } from '@sentry/react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, StyleSheet, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { auth, useAuthState } from '@/data/clients/auth'
import { useFavoritesSync } from '@/hooks/data/useFavoritesSync'
import { useTheme } from '@/hooks/themes/useThemeHooks'

/**
 * Prompts the user to sign in again after their session expired. Declining or a
 * failed sign-in clears local favourites; a successful sign-in lets the
 * AuthBridge merge them.
 */
export function SessionExpiredModal() {
  const { t } = useTranslation('SessionExpired')
  const { sessionExpired } = useAuthState()
  const { clearLocalFavorites } = useFavoritesSync()
  const theme = useTheme()
  const [busy, setBusy] = useState(false)

  const onSignIn = async () => {
    if (busy) return
    setBusy(true)
    try {
      await auth.login()
      if (!auth.state.isLoggedIn) await clearLocalFavorites()
    } catch (error) {
      captureException(error)
      await clearLocalFavorites().catch(captureException)
    } finally {
      auth.acknowledgeSessionExpired()
      setBusy(false)
    }
  }

  const onNotNow = async () => {
    if (busy) return
    setBusy(true)
    try {
      await clearLocalFavorites()
    } catch (error) {
      captureException(error)
    } finally {
      auth.acknowledgeSessionExpired()
      setBusy(false)
    }
  }

  return (
    <Modal
      visible={sessionExpired}
      transparent
      animationType='fade'
      onRequestClose={onNotNow}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { backgroundColor: theme.primary }]} />
          <View style={styles.body}>
            <Label type='h3' variant='middle'>
              {t('title')}
            </Label>
            <Label type='regular' style={styles.text}>
              {t('body')}
            </Label>
            <Button onPress={onSignIn} disabled={busy} style={styles.signIn}>
              {t('sign_in')}
            </Button>
            <Button outline onPress={onNotNow} disabled={busy}>
              {t('not_now')}
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
  signIn: {
    marginTop: 4,
  },
})
