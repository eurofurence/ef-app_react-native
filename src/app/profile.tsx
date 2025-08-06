import { captureException } from '@sentry/react-native'
import { Redirect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { appStyles } from '@/components/AppStyles'
import { ProfileContent } from '@/components/ProfileContent'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { vibrateAfter } from '@/util/vibrateAfter'
import { useUserContext } from '@/context/auth/User'

export default function Profile() {
  const { claims, user, refresh } = useUserContext()
  const [isReloading, setIsReloading] = useState(false)
  const { synchronize, isSynchronizing } = useCache()
  const backgroundStyle = useThemeBackground('background')
  const { t } = useTranslation('Profile')

  const doReload = useCallback(() => {
    if (isReloading) return

    setIsReloading(true)
    ;(async () => {
      try {
        await refresh()
      } catch (error) {
        captureException(error)
      } finally {
        setIsReloading(false)
      }
    })()
  }, [refresh, isReloading])

  // Navigate back if not logged in.
  if (!user) return <Redirect href="/" />

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
