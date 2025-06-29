import { captureException } from '@sentry/react-native'
import { Redirect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import { appStyles } from '@/components/AppStyles'
import { ProfileContent } from '@/components/ProfileContent'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { useAuthContext } from '@/context/auth/Auth'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { vibrateAfter } from '@/util/vibrateAfter'
import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'

export default function Profile() {
  const { loggedIn, refreshToken, claims } = useAuthContext()
  const { data: user, refetch } = useUserSelfQuery()
  const [isReloading, setIsReloading] = useState(false)
  const { synchronize, isSynchronizing } = useCache()
  const backgroundStyle = useThemeBackground('background')
  const { t } = useTranslation('Profile')

  const doReload = useCallback(() => {
    if (isReloading) return

    setIsReloading(true)
    ;(async () => {
      try {
        await refreshToken(true)
        await refetch()
      } catch (error) {
        captureException(error)
      } finally {
        setIsReloading(false)
      }
    })()
  }, [refreshToken, refetch, isReloading])

  // Navigate back if not logged in or unable to retrieve proper user data
  if (!loggedIn) return <Redirect href="/" />

  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, backgroundStyle]}
      refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={() => vibrateAfter(synchronize())} />}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
    >
      <Header secondaryIcon="refresh" secondaryPress={isReloading ? () => undefined : doReload} loading={isReloading}>
        {t('header')}
      </Header>
      <Floater contentStyle={appStyles.trailer}>{!claims || !user ? null : <ProfileContent claims={claims} user={user} parentPad={padFloater} />}</Floater>
    </ScrollView>
  )
}
