import { captureException } from '@sentry/react-native'
import { setStringAsync } from 'expo-clipboard'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet } from 'react-native'
import { Icon } from '@/components/generic/atoms/Icon'
import { Section } from '@/components/generic/atoms/Section'
import { Button, buttonIconSize } from '@/components/generic/containers/Button'
import { Row } from '@/components/generic/containers/Row'
import { Pressable } from '@/components/generic/Pressable'
import { apiBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { useToastContext } from '@/context/ui/ToastContext'
import { useFavoritesCalendarToken } from '@/hooks/api/events/useFavoritesCalendarToken'
import {
  useThemeBorder,
  useThemeColorValue,
} from '@/hooks/themes/useThemeHooks'

import { SettingContainer } from './SettingContainer'

export const CalendarSync = () => {
  const { t } = useTranslation('Settings', { keyPrefix: 'calendar' })
  const { loggedIn } = useAuthContext()
  const { toast } = useToastContext()
  const {
    data: token,
    isLoading,
    isError,
    refetch,
  } = useFavoritesCalendarToken()

  // Match the outline button's look for the icon-only copy affordance.
  const copyBorder = useThemeBorder('inverted')
  const copyColor = useThemeColorValue('important')

  // The feed is keyed to a per-user token, so it only exists when signed in.
  if (!loggedIn) return null

  const feedUrl = token
    ? `${apiBase}/Events/Favorites/calendar.ics/?token=${encodeURIComponent(token)}`
    : null

  // Convert to webcal scheme that lets the OS calendar subscribe to it for polling.
  const webcalUrl = feedUrl
    ? feedUrl.replace(/^https?:\/\//, 'webcal://')
    : null

  const onError = (error: unknown) => {
    captureException(error)
    toast('error', t('error'), 5000)
  }

  const onSubscribe = () => {
    if (!webcalUrl) return
    Linking.openURL(webcalUrl).catch(onError)
  }

  const onCopy = () => {
    if (!feedUrl) return
    setStringAsync(feedUrl)
      .then(() => toast('info', t('link_copied'), 3000))
      .catch(onError)
  }

  const subscribeDisabled = isLoading || !webcalUrl
  const copyDisabled = isLoading || !feedUrl

  return (
    <SettingContainer>
      <Section
        title={t('title')}
        subtitle={t('subtitle')}
        icon='calendar-sync'
      />

      {isError ? (
        <Button icon='refresh' onPress={() => refetch()}>
          {t('retry')}
        </Button>
      ) : (
        <Row type='stretch' gap={10}>
          <Button
            containerStyle={styles.subscribe}
            icon='calendar-export'
            onPress={onSubscribe}
            disabled={subscribeDisabled}
          >
            {t('subscribe')}
          </Button>
          <Pressable
            style={[styles.copy, copyBorder, copyDisabled && styles.disabled]}
            onPress={onCopy}
            disabled={copyDisabled}
            accessibilityLabel={t('copy_link')}
          >
            <Icon name='content-copy' size={buttonIconSize} color={copyColor} />
          </Pressable>
        </Row>
      )}
    </SettingContainer>
  )
}

const styles = StyleSheet.create({
  subscribe: {
    flex: 1,
  },
  copy: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
})
