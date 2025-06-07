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
import { useCache } from '@/context/data/Cache'
import { EventDayDetails } from '@/context/data/types.details'
import { isSameDay } from 'date-fns'
import { useNow } from '@/hooks/time/useNow'

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

function getInitialRoute(eventDays: readonly EventDayDetails[], now: Date) {
  if (!eventDays?.length) return undefined
  const today = eventDays.findIndex((item) => isSameDay(now, item.Date))
  return today >= 0 ? `day-${today + 1}` : 'day-1'
}

function dayTabTitle(day: EventDayDetails | undefined) {
  if (!day) return undefined
  const date = new Date(day.Date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
}

export default function ScheduleLayout() {
  const { query } = useLocalSearchParams<{ query?: string }>()

  const layout = useWindowDimensions()

  const now = useNow('static')

  const backgroundSurface = useThemeBackground('surface')
  const backgroundBackground = useThemeBackground('background')
  const backgroundSecondary = useThemeBackground('secondary')

  const { eventDays } = useCache()

  const initialRouteName = getInitialRoute(eventDays, now)

  return (
    <MaterialTopTabs
      initialRouteName={initialRouteName}
      style={StyleSheet.absoluteFill}
      screenOptions={{ sceneStyle: backgroundSurface }}
      tabBar={(props) => {
        const { key, ...propsWithoutKey } = props as typeof props & { key: any }
        return (
          <View>
            <TabBar
              {...propsWithoutKey}
              navigationState={{ routes: props.state.routes, index: props.state.index }}
              style={backgroundBackground}
              indicatorStyle={backgroundSecondary}
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
              tabStyle={{ width: layout.width / props.state.routes.length }}
            />
            <Search style={styles.search} filter={query || ''} setFilter={setFilter} />
          </View>
        )
      }}
    >
      <MaterialTopTabs.Screen name="filter" options={{ title: 'Filter', icon: 'filter-variant' }} />
      <MaterialTopTabs.Screen name="personal" options={{ title: 'Personal', icon: 'calendar-heart' }} />
      <MaterialTopTabs.Screen name="day-1" options={{ title: dayTabTitle(eventDays[0]) }} redirect={eventDays.length < 1} />
      <MaterialTopTabs.Screen name="day-2" options={{ title: dayTabTitle(eventDays[1]) }} redirect={eventDays.length < 2} />
      <MaterialTopTabs.Screen name="day-3" options={{ title: dayTabTitle(eventDays[2]) }} redirect={eventDays.length < 3} />
      <MaterialTopTabs.Screen name="day-4" options={{ title: dayTabTitle(eventDays[3]) }} redirect={eventDays.length < 4} />
      <MaterialTopTabs.Screen name="day-5" options={{ title: dayTabTitle(eventDays[4]) }} redirect={eventDays.length < 5} />
      <MaterialTopTabs.Screen name="day-6" options={{ title: dayTabTitle(eventDays[5]) }} redirect={eventDays.length < 6} />
      <MaterialTopTabs.Screen name="day-7" options={{ title: dayTabTitle(eventDays[6]) }} redirect={eventDays.length < 7} />
    </MaterialTopTabs>
  )
}

const styles = StyleSheet.create({
  search: {
    marginVertical: 10,
  },
})
