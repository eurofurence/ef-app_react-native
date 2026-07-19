import { useLiveQuery } from '@tanstack/react-db'
import { withLayoutContext } from 'expo-router'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  type MaterialTopTabBarProps,
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
} from 'expo-router/js-top-tabs'
import type {
  ParamListBase,
  TabNavigationState,
} from 'expo-router/react-navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon, type IconNames } from '@/components/generic/atoms/Icon'
import { Search } from '@/components/generic/atoms/Search'
import { ComingSoon } from '@/components/generic/containers/ComingSoon'
import { conName } from '@/configuration'
import { DealersSearchContext } from '@/context/DealersSearchContext'
import { dealersFullCollection } from '@/data/collections/content/DealersFull'
import { useSearchIds } from '@/data/searching/useSearch'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

export const unstable_settings = {
  initialRouteName: 'all',
}

const { Navigator } = createMaterialTopTabNavigator()

/**
 * Customized tab view for this layout.
 */
const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

function createOptions(
  title: string | undefined,
  icon: IconNames | undefined = undefined
): MaterialTopTabNavigationOptions {
  if (icon === undefined) return { title: title }
  return {
    title: title,
    tabBarShowLabel: false,
    tabBarIcon: ({ color }) => <Icon name={icon} color={color} size={20} />,
    tabBarShowIcon: true,
  }
}

export default function DealersLayout() {
  const { t } = useTranslation('Dealers')
  const insets = useSafeAreaInsets()
  const backgroundSurface = useThemeBackground('surface')
  const { data: dealers, isReady } = useLiveQuery(dealersFullCollection)
  const [query, setQuery] = useState('')
  const results = useSearchIds(dealersFullCollection, query)

  const options = useMemo(() => {
    return {
      personal: createOptions('Faves', 'calendar-heart'),
      all: createOptions('All'),
      regular: createOptions('Regular'),
      ad: createOptions('AD'),
      az: createOptions('A-Z', 'order-alphabetical-ascending'),
    }
  }, [])

  if (isReady && dealers.length === 0)
    return (
      <ComingSoon
        image={require('@/assets/static/dealersempty.png')}
        title={t('coming_soon_title')}
        text={t('coming_soon_body', { conName })}
      />
    )

  return (
    <DealersSearchContext.Provider value={{ query, setQuery, results }}>
      <MaterialTopTabs
        initialRouteName='all'
        style={StyleSheet.absoluteFill}
        screenOptions={{
          tabBarStyle: { paddingTop: insets.top },
          sceneStyle: backgroundSurface,
          tabBarLabelStyle: styles.tabLabel,
        }}
        tabBar={(props: MaterialTopTabBarProps) => (
          <View style={styles.tabBarContainer}>
            <MaterialTopTabBar {...props} />
            <Search
              className={'my-2.5 mx-2.5'}
              filter={query}
              setFilter={setQuery}
              placeholder={t('search.placeholder')}
            />
          </View>
        )}
      >
        <MaterialTopTabs.Screen name='personal' options={options.personal} />
        <MaterialTopTabs.Screen name='all' options={options.all} />
        <MaterialTopTabs.Screen name='regular' options={options.regular} />
        <MaterialTopTabs.Screen name='ad' options={options.ad} />
        <MaterialTopTabs.Screen name='az' options={options.az} />
      </MaterialTopTabs>
    </DealersSearchContext.Provider>
  )
}

const styles = StyleSheet.create({
  tabLabel: {
    margin: 0,
  },
  tabBarContainer: {
    backgroundColor: 'transparent',
  },
})
