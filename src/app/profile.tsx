import { captureException } from '@sentry/react-native'
import { Redirect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { ProfileContent } from '@/components/ProfileContent'
import { useCache } from '@/context/data/Cache'
import { auth, useAuthState } from '@/data/clients/auth'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { vibrateAfter } from '@/util/vibrateAfter'

export default function Profile() {
  const { isLoggedIn, claims, user } = useAuthState()
  const [isReloading, setIsReloading] = useState(false)
  const { synchronize, isSynchronizing } = useCache()
  const backgroundStyle = useThemeBackground('background')
  const { t } = useTranslation('Profile')
  const { t: a11y } = useTranslation('Accessibility')

  const doReload = useCallback(() => {
    if (isReloading) return

    setIsReloading(true)
    ;(async () => {
      try {
        await auth.refresh()
      } catch (error) {
        captureException(error)
      } finally {
        setIsReloading(false)
      }
    })()
  }, [isReloading])

  // Navigate back if not logged in.
  if (!isLoggedIn) return <Redirect href='/' />

  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, backgroundStyle]}
      refreshControl={
        <RefreshControl
          refreshing={isSynchronizing}
          onRefresh={() => vibrateAfter(synchronize())}
          accessibilityLabel={a11y('pull_to_refresh')}
        />
      }
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
      accessibilityLabel={t('accessibility.profile_scroll_view')}
      accessibilityHint={t('accessibility.profile_scroll_view_hint')}
    >
      <Header
        secondaryIcon='refresh'
        secondaryPress={isReloading ? () => undefined : doReload}
        loading={isReloading}
      >
        {t('header')}
      </Header>
      <Floater contentStyle={appStyles.trailer}>
        {!claims || !user ? (
          <View accessibilityLabel={t('accessibility.loading_profile')}>
            {null}
          </View>
        ) : (
          <View accessibilityLabel={t('accessibility.profile_content_area')}>
            <ProfileContent
              claims={claims}
              user={user}
              parentPad={padFloater}
            />
          </View>
        )}
      </Floater>
    </ScrollView>
  )
}
