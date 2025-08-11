import { useIsFocused } from '@react-navigation/core'
import { formatDistance, isAfter, isBefore } from 'date-fns'
import { TFunction } from 'i18next'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useUserContext } from '@/context/auth/User'
import { useCache } from '@/context/data/Cache'
import { useRegistrationDatesQuery } from '@/hooks/api/registration/useRegistrationDatesQuery'
import { useWarningState } from '@/hooks/data/useWarningState'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { Linking } from 'react-native'
import { Icon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { Button } from '../generic/containers/Button'
import { captureException } from '@sentry/react-native'
import { useAuthContext } from '@/context/auth/Auth'

export type RegistrationCountdownProps = {
  registrationUrl?: string
}

/**
 * Calculates the countdown text and button visibility based on registration dates
 */
const useRegistrationState = (t: TFunction, now: Date, startDate: Date | null, endDate: Date | null, isLoading: boolean, error: Error | null) => {
  const { eventDays } = useCache()

  if (isLoading || error || !startDate || !endDate) {
    return { countdownText: null, isRegistrationOpen: false }
  }

  // Check if we're after the current convention but before next registration opens
  if (eventDays.length > 0) {
    const lastDay = eventDays[eventDays.length - 1]
    const lastDate = new Date(lastDay.Date)

    if (isAfter(now, lastDate) && isBefore(now, startDate)) {
      return { countdownText: t('thank_you_see_you_next_year'), isRegistrationOpen: false }
    }
  }

  // If registration hasn't opened yet
  if (isBefore(now, startDate)) {
    const diff = formatDistance(startDate, now)
    return { countdownText: t('registration_opens_in', { diff }), isRegistrationOpen: false }
  }

  // If registration is open
  if (isBefore(now, endDate)) {
    return { countdownText: t('registration_open'), isRegistrationOpen: true }
  }

  // If registration has closed
  return { countdownText: t('registration_closed'), isRegistrationOpen: false }
}

export const RegistrationCountdown: FC<RegistrationCountdownProps> = ({ registrationUrl }) => {
  const { t } = useTranslation('Registration')
  const { t: tWarnings } = useTranslation('Home', { keyPrefix: 'warnings' })
  const { t: tAccessibility } = useTranslation('Home', { keyPrefix: 'accessibility' })
  const isFocused = useIsFocused()
  const now = useNow(isFocused ? 60 : 'static')
  const { isHidden, hideWarning } = useWarningState('registrationCountdownHidden')
  const iconColor = useThemeColorValue('important')
  const { data, isLoading, error } = useRegistrationDatesQuery()
  const { user } = useUserContext()
  const { login } = useAuthContext()

  const { countdownText, isRegistrationOpen } = useRegistrationState(t, now, data?.startDate ?? null, data?.endDate ?? null, isLoading, error)

  const handleRegisterPress = useMemo(() => {
    if (!isRegistrationOpen || !registrationUrl) return undefined

    return () => {
      Linking.openURL(registrationUrl).catch(console.error)
    }
  }, [isRegistrationOpen, registrationUrl])

  // Don't show if dismissed, if loading, if there's an error, or if user is logged in AND is an attendee
  const isAttendee = Boolean(user?.RoleMap?.Attendee)
  const loggedIn = Boolean(user)
  if (isHidden || isLoading || error || (loggedIn && isAttendee && isRegistrationOpen)) return null
  const showRegistrationButton = isRegistrationOpen && registrationUrl
  const showLoginButton = !loggedIn
  const showButtons = showLoginButton || showRegistrationButton

  return (
    <>
      <View className="pt-8 pb-4 self-stretch" role="alert" accessibilityLabel={tAccessibility('registration_warning_container')}>
        <View className="self-stretch flex-row items-center">
          <Icon color={iconColor} name="account-plus" size={24} accessibilityLabel={tAccessibility('registration_icon')} accessibilityRole="image" />
          <Label className="ml-2 flex-1" type="h2" color="important" ellipsizeMode="tail" accessibilityRole="header">
            {t('registration_title')}
          </Label>
          <Label
            className="leading-8"
            type="compact"
            variant="bold"
            color="secondary"
            onPress={hideWarning}
            accessibilityRole="button"
            accessibilityLabel={tAccessibility('hide_registration_warning')}
            accessibilityHint={tAccessibility('hide_registration_warning_hint')}
          >
            {tWarnings('hide')}
          </Label>
        </View>
      </View>

      <Label type="para" accessibilityLabel={tAccessibility('registration_status', { status: countdownText })}>
        {countdownText} {loggedIn || t('login_prompt')}
      </Label>

      {showButtons && (
        <View className="flex flex-row mt-5 gap-2">
          {showRegistrationButton && (
            <Button
              icon="web"
              className="grow"
              onPress={handleRegisterPress}
              accessibilityLabel={tAccessibility('accessibility.register_now_button')}
              accessibilityHint={tAccessibility('accessibility.register_now_button_hint')}
            >
              {t('register_now')}
            </Button>
          )}
          {showLoginButton && (
            <Button
              icon="login"
              outline
              className="grow"
              onPress={() => login().catch(captureException)}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.login_button')}
              accessibilityHint={t('accessibility.login_button_hint')}
            >
              {t('login')}
            </Button>
          )}
        </View>
      )}
    </>
  )
}
