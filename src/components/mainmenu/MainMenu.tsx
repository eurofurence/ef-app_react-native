import { captureException } from '@sentry/react-native'
import { router } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import { RefObject, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

import { Col } from '@/components/generic/containers/Col'
import { Grid } from '@/components/generic/containers/Grid'
import { Tab } from '@/components/generic/containers/Tab'
import { TabsRef } from '@/components/generic/containers/Tabs'
import { PagerPrimaryLogin } from '@/components/mainmenu/PagerPrimaryLogin'
import { catchEmUrl, conWebsite, efnavMapUrl, menuColumns, showCatchEm, showLogin } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { useUserContext } from '@/context/auth/User'

export type MainMenuProps = {
  tabs: RefObject<TabsRef | null>
}

export function MainMenu({ tabs }: MainMenuProps) {
  const { t } = useTranslation('Menu')
  const { loggedIn, login } = useAuthContext()
  const { claims } = useUserContext()

  const handleLogin = useCallback(() => {
    login().catch(captureException)
  }, [login])

  const handleCatchEmAll = useCallback(async () => {
    if (!loggedIn) {
      alert(t('not_logged_in'))
      return
    }
    await Linking.openURL(catchEmUrl).catch(console.error)
    tabs.current?.close()
  }, [t, loggedIn, tabs])

  return (
    <Col type="stretch">
      {showLogin && (
        <PagerPrimaryLogin
          loggedIn={loggedIn}
          claims={claims}
          onMessages={() => router.navigate('/messages')}
          onLogin={handleLogin}
          onProfile={() => router.navigate('/profile')}
        />
      )}

      <Grid cols={menuColumns}>
        <Tab
          icon="information-outline"
          text={t('info')}
          onPress={() => router.navigate('/knowledge')}
          accessibilityLabel={t('accessibility.info_tab')}
          accessibilityHint={t('accessibility.info_tab_hint')}
        />
        {showCatchEm && (
          <Tab
            icon="paw"
            text={t('catch_em')}
            onPress={handleCatchEmAll}
            disabled={!loggedIn}
            accessibilityLabel={t('accessibility.catch_em_tab')}
            accessibilityHint={loggedIn ? t('accessibility.catch_em_tab_hint') : t('accessibility.catch_em_tab_disabled_hint')}
          />
        )}
        <Tab
          icon="image-frame"
          text={t('artist_alley')}
          onPress={() => router.navigate('/artists-alley')}
          accessibilityLabel={t('accessibility.artist_alley_tab')}
          accessibilityHint={t('accessibility.artist_alley_tab_hint')}
        />
        <Tab
          icon="card-account-details-outline"
          text={t('profile')}
          onPress={() => router.navigate('/profile')}
          disabled={!loggedIn}
          accessibilityLabel={t('accessibility.profile_tab')}
          accessibilityHint={loggedIn ? t('accessibility.profile_tab_hint') : t('accessibility.profile_tab_disabled_hint')}
        />
        <Tab
          icon="cog"
          text={t('settings')}
          onPress={() => router.navigate('/settings')}
          accessibilityLabel={t('accessibility.settings_tab')}
          accessibilityHint={t('accessibility.settings_tab_hint')}
        />
        <Tab
          icon="magnify"
          text={t('lost_and_found')}
          onPress={() => router.navigate('/lost-and-found')}
          disabled={!loggedIn}
          accessibilityLabel={t('accessibility.lost_found_tab')}
          accessibilityHint={loggedIn ? t('accessibility.lost_found_tab_hint') : t('accessibility.lost_found_tab_disabled_hint')}
        />
        <Tab
          icon="web"
          text={t('website')}
          onPress={() => Linking.openURL(conWebsite)}
          accessibilityLabel={t('accessibility.website_tab')}
          accessibilityHint={t('accessibility.website_tab_hint')}
        />
        <Tab
          icon="map"
          text={t('map')}
          onPress={() => openBrowserAsync(efnavMapUrl)}
          accessibilityLabel={t('accessibility.map_tab')}
          accessibilityHint={t('accessibility.map_tab_hint')}
        />
        <Tab
          icon="information"
          text={t('about')}
          onPress={() => router.navigate('/about')}
          accessibilityLabel={t('accessibility.about_tab')}
          accessibilityHint={t('accessibility.about_tab_hint')}
        />
      </Grid>
    </Col>
  )
}
