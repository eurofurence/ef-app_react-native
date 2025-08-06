import { useIsFocused } from '@react-navigation/core'
import { formatDistance, isAfter, isBefore } from 'date-fns'
import { TFunction } from 'i18next'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useAuthContext } from '@/context/auth/Auth'
import { useCache } from '@/context/data/Cache'
import { useRegistrationDatesQuery } from '@/hooks/api/registration/useRegistrationDatesQuery'
import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { useWarningState } from '@/hooks/data/useWarningState'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { Linking } from 'react-native'
import { Icon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { Button } from '../generic/containers/Button'
import { Col } from '../generic/containers/Col'
import { padFloater } from '../generic/containers/Floater'
import { Row } from '../generic/containers/Row'

export type RegistrationCountdownProps = {
  registrationUrl?: string
}

/**
 * Calculates the countdown text and button visibility based on registration dates
 */
const useRegistrationState = (t: TFunction, now: Date, startDate: Date | null, endDate: Date | null, isLoading: boolean, error: Error | null) => {
  const { eventDays } = useCache()

  if (isLoading || error || !startDate || !endDate) {
    return { countdownText: null, showButton: false }
  }

  // Check if we're after the current convention but before next registration opens
  if (eventDays.length > 0) {
    const lastDay = eventDays[eventDays.length - 1]
    const lastDate = new Date(lastDay.Date)

    if (isAfter(now, lastDate) && isBefore(now, startDate)) {
      return { countdownText: t('thank_you_see_you_next_year'), showButton: false }
    }
  }

  // If registration hasn't opened yet
  if (isBefore(now, startDate)) {
    const diff = formatDistance(startDate, now)
    return { countdownText: t('registration_opens_in', { diff }), showButton: false }
  }

  // If registration is open
  if (isBefore(now, endDate)) {
    return { countdownText: t('registration_open'), showButton: true }
  }

  // If registration has closed
  return { countdownText: t('registration_closed'), showButton: false }
}

export const RegistrationCountdown: FC<RegistrationCountdownProps> = ({ registrationUrl }) => {
  const { t } = useTranslation('Registration')
  const { t: tWarnings } = useTranslation('Home', { keyPrefix: 'warnings' })
  const isFocused = useIsFocused()
  const now = useNow(isFocused ? 60 : 'static')
  const { isHidden, hideWarning } = useWarningState('registrationCountdownHidden')
  const iconColor = useThemeColorValue('important')
  const { data, isLoading, error } = useRegistrationDatesQuery()
  const { loggedIn } = useAuthContext()
  const { data: user } = useUserSelfQuery()

  const { countdownText, showButton } = useRegistrationState(t, now, data?.startDate ?? null, data?.endDate ?? null, isLoading, error)

  const handleRegisterPress = useMemo(() => {
    if (!showButton || !registrationUrl) return undefined

    return () => {
      Linking.openURL(registrationUrl).catch(console.error)
    }
  }, [showButton, registrationUrl])

  // Don't show if dismissed, if loading, if there's an error, or if user is logged in AND is an attendee
  const isAttendee = Boolean(user?.RoleMap?.Attendee)
  if (isHidden === true || isLoading || error || (loggedIn && isAttendee)) return null

  return (
    <View style={styles.container}>
      <Col style={styles.sectionContainer}>
        <Row type="center">
          <Icon color={iconColor} style={styles.icon} name="account-plus" size={24} />
          <Label style={styles.titleFill} type="h2" color="important" ellipsizeMode="tail">
            {t('registration_title')}
          </Label>
          <Label type="compact" variant="bold" color="secondary" onPress={hideWarning}>
            {tWarnings('hide')}
          </Label>
        </Row>
      </Col>
      <Label type="para">{countdownText}</Label>
      {showButton && registrationUrl && (
        <Button style={styles.registerButton} icon="web" onPress={handleRegisterPress}>
          {t('register_now')}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: padFloater,
  },
  sectionContainer: {
    paddingTop: 30,
    paddingBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  titleFill: {
    flex: 1,
  },
  registerButton: {
    marginTop: 20,
  },
})
