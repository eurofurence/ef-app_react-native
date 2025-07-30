import { Col } from '@/components/generic/containers/Col'
import { Grid } from '@/components/generic/containers/Grid'
import { Tab } from '@/components/generic/containers/Tab'
import { TabsRef } from '@/components/generic/containers/Tabs'
import { PagerPrimaryLogin } from '@/components/mainmenu/PagerPrimaryLogin'
import { catchEmUrl, conWebsite, efnavMapUrl, menuColumns, showCatchEm, showLogin } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { captureException } from '@sentry/react-native'
import { router } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import { RefObject, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

export type MainMenuProps = {
  tabs: RefObject<TabsRef | null>
}

export function MainMenu({ tabs }: MainMenuProps) {
  const { t } = useTranslation('Menu')
  const { loggedIn, claims, login } = useAuthContext()

  const handleNavigation = useCallback(
    (path: string) => {
      router.navigate(path)
      tabs.current?.close()
    },
    [tabs]
  )

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
          claim={claims}
          onMessages={() => handleNavigation('/messages')}
          onLogin={handleLogin}
          onProfile={() => handleNavigation('/profile')}
        />
      )}

      <Grid cols={menuColumns}>
        <Tab icon="information-outline" text={t('info')} onPress={() => handleNavigation('/knowledge')} />
        {showCatchEm && <Tab icon="paw" text={t('catch_em')} onPress={handleCatchEmAll} disabled={!loggedIn} />}
        <Tab icon="image-frame" text={t('artist_alley')} onPress={() => handleNavigation('/artists-alley')} />
        <Tab icon="card-account-details-outline" text={t('profile')} onPress={() => handleNavigation('/profile')} disabled={!loggedIn} />
        <Tab icon="cog" text={t('settings')} onPress={() => handleNavigation('/settings')} />
        <Tab icon="magnify" text={t('lost_and_found')} onPress={() => handleNavigation('/lost-and-found')} />
        <Tab icon="web" text={t('website')} onPress={() => Linking.openURL(conWebsite)} />
        <Tab icon="map" text={t('map')} onPress={() => openBrowserAsync(efnavMapUrl)} />
        <Tab icon="information" text={t('about')} onPress={() => handleNavigation('/about')} />
      </Grid>
    </Col>
  )
}
