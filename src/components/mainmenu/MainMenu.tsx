import { captureException } from '@sentry/react-native'
import { router } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import { type RefObject, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'

import { Col } from '@/components/generic/containers/Col'
import { Grid } from '@/components/generic/containers/Grid'
import { Tab } from '@/components/generic/containers/Tab'
import type { TabsRef } from '@/components/generic/containers/Tabs'
import { PagerPrimaryLogin } from '@/components/mainmenu/PagerPrimaryLogin'
import { conWebsite, menuColumns, showLogin } from '@/configuration'
import { auth, useAuthState } from '@/data/clients/auth'
import { useAppConfig } from '@/hooks/data/useAppConfig'

export type MainMenuProps = {
  tabs: RefObject<TabsRef | null>
}

export function MainMenu({ tabs }: MainMenuProps) {
  const { t } = useTranslation('Menu')
  const { isLoggedIn, claims } = useAuthState()
  const { cmaUrl, mapsUrl, wifiConfigDisabled } = useAppConfig()

  const handleCatchEmAll = useCallback(async () => {
    if (!isLoggedIn) {
      alert(t('not_logged_in'))
      return
    }
    if (cmaUrl) await Linking.openURL(cmaUrl).catch(console.error)
    tabs.current?.close()
  }, [t, isLoggedIn, tabs, cmaUrl])

  return (
    <Col type='stretch'>
      {showLogin === 'true' && (
        <PagerPrimaryLogin
          loggedIn={isLoggedIn}
          claims={claims}
          onMessages={() => router.navigate('/messages')}
          onLogin={() => auth.login().catch(captureException)}
          onProfile={() => router.navigate('/profile')}
        />
      )}

      <Grid cols={menuColumns}>
        <Tab
          icon='information-outline'
          text={t('info')}
          onPress={() => router.navigate('/knowledge')}
          accessibilityLabel={t('accessibility.info_tab')}
          accessibilityHint={t('accessibility.info_tab_hint')}
        />
        {cmaUrl && (
          <Tab
            icon='paw'
            text={t('catch_em')}
            onPress={handleCatchEmAll}
            disabled={!isLoggedIn}
            accessibilityLabel={t('accessibility.catch_em_tab')}
            accessibilityHint={
              isLoggedIn
                ? t('accessibility.catch_em_tab_hint')
                : t('accessibility.catch_em_tab_disabled_hint')
            }
          />
        )}
        <Tab
          icon='image-frame'
          text={t('artist_alley')}
          onPress={() => router.navigate('/artists-alley')}
          accessibilityLabel={t('accessibility.artist_alley_tab')}
          accessibilityHint={t('accessibility.artist_alley_tab_hint')}
        />
        <Tab
          icon='card-account-details-outline'
          text={t('profile')}
          onPress={() => router.navigate('/profile')}
          disabled={!isLoggedIn}
          accessibilityLabel={t('accessibility.profile_tab')}
          accessibilityHint={
            isLoggedIn
              ? t('accessibility.profile_tab_hint')
              : t('accessibility.profile_tab_disabled_hint')
          }
        />
        <Tab
          icon='cog'
          text={t('settings')}
          onPress={() => router.navigate('/settings')}
          accessibilityLabel={t('accessibility.settings_tab')}
          accessibilityHint={t('accessibility.settings_tab_hint')}
        />
        {Platform.OS !== 'web' && !wifiConfigDisabled && (
          <Tab
            icon='wifi'
            text={t('wifi')}
            onPress={() => router.navigate('/wifi')}
            accessibilityLabel={t('accessibility.wifi_tab')}
            accessibilityHint={t('accessibility.wifi_tab_hint')}
          />
        )}
        <Tab
          icon='magnify'
          text={t('lost_and_found')}
          onPress={() => router.navigate('/lost-and-found')}
          disabled={!isLoggedIn}
          accessibilityLabel={t('accessibility.lost_found_tab')}
          accessibilityHint={
            isLoggedIn
              ? t('accessibility.lost_found_tab_hint')
              : t('accessibility.lost_found_tab_disabled_hint')
          }
        />
        <Tab
          icon='web'
          text={t('website')}
          onPress={() => Linking.openURL(conWebsite)}
          accessibilityLabel={t('accessibility.website_tab')}
          accessibilityHint={t('accessibility.website_tab_hint')}
        />
        {mapsUrl && (
          <Tab
            icon='map'
            text={t('map')}
            onPress={() => openBrowserAsync(mapsUrl)}
            accessibilityLabel={t('accessibility.map_tab')}
            accessibilityHint={t('accessibility.map_tab_hint')}
          />
        )}
        <Tab
          icon='information'
          text={t('about')}
          onPress={() => router.navigate('/about')}
          accessibilityLabel={t('accessibility.about_tab')}
          accessibilityHint={t('accessibility.about_tab_hint')}
        />
      </Grid>
    </Col>
  )
}
