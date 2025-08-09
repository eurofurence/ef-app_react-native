import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/generic/containers/Button'
import { ArtistsAlleySectionedList } from '@/components/artists-alley/ArtistsAlleySectionedList'
import { useCache } from '@/context/data/Cache'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistAlleyDetails } from '@/context/data/types.details'
import { Label } from '@/components/generic/atoms/Label'
import { useIsFocused } from '@react-navigation/core'
import { useUserContext } from '@/context/auth/User'
import { useAuthContext } from '@/context/auth/Auth'
import { captureException } from '@sentry/react-native'
import { artistAlleyUrl } from '@/configuration'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { vibrateAfter } from '@/util/vibrateAfter'

export default function List() {
  const { t } = useTranslation('ArtistsAlley')
  const { user } = useUserContext()
  const { login } = useAuthContext()
  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)
  const { artistAlley, synchronize, isSynchronizing } = useCache()

  // Get roles for preemptive RBAC.
  const isLoggedIn = Boolean(user)
  const isAttending = Boolean(user?.RoleMap?.Attendee)
  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)
  const isPrivileged = Boolean(user?.RoleMap?.Admin) || Boolean(user?.RoleMap?.ArtistAlleyAdmin) || Boolean(user?.RoleMap?.ArtistAlleyModerator)
  const isAuthorized = isCheckedIn || isPrivileged

  // Sync on focus, artist alley data might change more frequently than other parts of the app.
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) synchronize().catch(console.error)
  }, [isFocused, synchronize])

  useEffect(() => {
    if (isAuthorized) {
      setAnnouncementMessage(t('accessibility.artists_alley_list_loaded'))
    } else {
      setAnnouncementMessage(t('accessibility.artists_alley_unauthorized'))
    }
  }, [isAuthorized, t])

  const leader = useMemo(() => {
    return (
      <View className="m-5 gap-4">
        <Label type="para">{t('intro')}</Label>
        <Button
          icon="link"
          outline
          onPress={() => Linking.openURL(artistAlleyUrl)}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.learn_more_button')}
          accessibilityHint={t('accessibility.learn_more_button_hint')}
        >
          {t('learn_more')}
        </Button>

        {!isCheckedIn ? null : (
          <Button
            icon="application-edit-outline"
            onPress={() => router.navigate('/artists-alley/reg')}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.register_self_button')}
            accessibilityHint={t('accessibility.register_self_button_hint')}
          >
            {t('list.register_self')}
          </Button>
        )}
        {!isPrivileged ? null : (
          <Button
            icon="shield-plus-outline"
            onPress={() => router.navigate('/artists-alley/moderate')}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.moderate_button')}
            accessibilityHint={t('accessibility.moderate_button_hint')}
          >
            {t('list.moderate')}
          </Button>
        )}
      </View>
    )
  }, [isPrivileged, isCheckedIn, t])

  const empty = useMemo(
    () => (
      <Label type="h3" className="mx-5" variant="middle">
        {t('list.artists_alley_empty')}
      </Label>
    ),
    [t]
  )
  const onPress = useCallback((item: ArtistAlleyDetails | TableRegistrationRecord) => {
    router.navigate({
      pathname: '/artists-alley/[id]',
      params: { id: item.Id },
    })
  }, [])

  if (!isAuthorized) {
    const disabledReason =
      // Needs to be logged in.
      (!isLoggedIn && t('unauthorized_not_logged_in')) ||
      // Must be attending.
      (!isAttending && t('unauthorized_not_attending')) ||
      // Must be checked in.
      (!isCheckedIn && t('unauthorized_not_checked_in'))

    return (
      <>
        <StatusMessage message={announcementMessage} />
        <View style={StyleSheet.absoluteFill}>
          <Header>{t('list.header')}</Header>
          <View className="m-5 pb-24" ref={mainContentRef} accessibilityLabel={t('accessibility.artists_alley_unauthorized_content')} accessibilityRole="text">
            <Label type="para" className="mb-5">
              {t('intro')}
            </Label>
            <Button
              icon="link"
              onPress={() => Linking.openURL(artistAlleyUrl)}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.learn_more_button')}
              accessibilityHint={t('accessibility.learn_more_button_hint')}
            >
              {t('learn_more')}
            </Button>
            <Label type="compact" className="my-5">
              {t('explanation_unauthorized')}

              {disabledReason && (
                <Label color="important" variant="bold">
                  {' ' + disabledReason}
                </Label>
              )}
            </Label>
            {isLoggedIn ? null : (
              <Button
                iconRight="login"
                onPress={() => login().catch(captureException)}
                accessibilityRole="button"
                accessibilityLabel={t('accessibility.login_button')}
                accessibilityHint={t('accessibility.login_button_hint')}
              >
                {t('log_in_now')}
              </Button>
            )}
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <View style={StyleSheet.absoluteFill}>
        <Header>{t('list.header')}</Header>
        <ArtistsAlleySectionedList
          items={[...artistAlley]}
          onPress={onPress}
          onRefresh={() => vibrateAfter(synchronize())}
          refreshing={isSynchronizing}
          leader={leader}
          empty={empty}
        />
      </View>
    </>
  )
}
