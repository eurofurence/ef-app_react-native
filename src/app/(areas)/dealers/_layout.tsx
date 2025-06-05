import type { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import type { MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs'
import { router, useLocalSearchParams, withLayoutContext } from 'expo-router'
import { TabBar } from 'react-native-tab-view'
import * as React from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { TabLabel } from '@/components/generic/atoms/TabLabel'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Search } from '@/components/generic/atoms/Search'
import { IconNames } from '@/components/generic/atoms/Icon'

const { Navigator } = createMaterialTopTabNavigator()

/**
 * Customized screen options for unified icon rendering handling.
 */
type TabViewOptions = MaterialTopTabNavigationOptions & { icon?: IconNames }

/**
 * Customized tab view for this layout.
 */
const MaterialTopTabs = withLayoutContext<TabViewOptions, typeof Navigator, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>(Navigator)

function setFilter(value: string) {
  router.setParams({ query: value })
}

export default function DealersLayout() {
  const { query } = useLocalSearchParams<{ query?: string }>()

  const layout = useWindowDimensions()

  const backgroundSurface = useThemeBackground('surface')
  const backgroundBackground = useThemeBackground('background')
  const backgroundSecondary = useThemeBackground('secondary')

  return (
    <MaterialTopTabs
      initialRouteName="all"
      style={StyleSheet.absoluteFill}
      screenOptions={{ sceneStyle: backgroundSurface }}
      tabBar={(props) => {
        const { key, ...propsWithoutKey } = props as typeof props & { key: any }
        return (
          <View>
            <TabBar
              {...propsWithoutKey}
              navigationState={{ routes: props.state.routes, index: props.state.index }}
              renderTabBarItem={({ labelStyle, key, ...tabBarItemProps }) => {
                const routeKey = tabBarItemProps.route.key
                const options = (props.descriptors[routeKey]?.options as TabViewOptions) || {}
                return (
                  <TabLabel
                    focused={tabBarItemProps.navigationState.index === props.state.routes.findIndex((r) => r.key === routeKey)}
                    icon={options.icon}
                    title={options.title}
                    labelStyle={labelStyle}
                  />
                )
              }}
              style={backgroundBackground}
              indicatorStyle={backgroundSecondary}
              tabStyle={{ width: layout.width / props.state.routes.length }}
            />
            <Search style={styles.search} filter={query || ''} setFilter={setFilter} />
          </View>
        )
      }}
    >
      <MaterialTopTabs.Screen name="personal" options={{ title: 'Faves', icon: 'calendar-heart' }} />
      <MaterialTopTabs.Screen name="all" options={{ title: 'All' }} />
      <MaterialTopTabs.Screen name="regular" options={{ title: 'Regular' }} />
      <MaterialTopTabs.Screen name="ad" options={{ title: 'AD' }} />
      <MaterialTopTabs.Screen name="az" options={{ title: 'A-Z', icon: 'order-alphabetical-ascending' }} />
    </MaterialTopTabs>
  )
}

const styles = StyleSheet.create({
  search: {
    marginVertical: 10,
  },
})
