import type { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs'
import type { MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs'
import { router, useLocalSearchParams, withLayoutContext } from 'expo-router'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Search } from '@/components/generic/atoms/Search'
import { Icon, IconNames } from '@/components/generic/atoms/Icon'

const { Navigator } = createMaterialTopTabNavigator()

/**
 * Customized tab view for this layout.
 */
const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions, typeof Navigator, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>(Navigator)

function setFilter(value: string) {
  router.setParams({ query: value })
}

function createOptions(title: string | undefined, icon: IconNames | undefined = undefined): MaterialTopTabNavigationOptions {
  if (icon === undefined) return { title: title }
  return {
    title: title,
    tabBarShowLabel: false,
    tabBarIcon: ({ color }) => <Icon name={icon} color={color} size={20} />,
    tabBarShowIcon: true,
  }
}

export default function DealersLayout() {
  const { query } = useLocalSearchParams<{ query?: string }>()

  const backgroundSurface = useThemeBackground('surface')

  return (
    <MaterialTopTabs
      initialRouteName="all"
      style={StyleSheet.absoluteFill}
      screenOptions={{ sceneStyle: backgroundSurface }}
      tabBar={(props) => (
        <View>
          <MaterialTopTabBar {...props} />
          <Search style={styles.search} filter={query || ''} setFilter={setFilter} />
        </View>
      )}
    >
      <MaterialTopTabs.Screen name="personal" options={createOptions('Faves', 'calendar-heart')} />
      <MaterialTopTabs.Screen name="all" options={createOptions('All')} />
      <MaterialTopTabs.Screen name="regular" options={createOptions('Regular')} />
      <MaterialTopTabs.Screen name="ad" options={createOptions('AD')} />
      <MaterialTopTabs.Screen name="az" options={createOptions('A-Z', 'order-alphabetical-ascending')} />
    </MaterialTopTabs>
  )
}

const styles = StyleSheet.create({
  search: {
    marginVertical: 10,
  },
})
