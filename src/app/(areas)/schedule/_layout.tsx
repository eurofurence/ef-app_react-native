import type { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs'
import type { MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs'
import { router, useLocalSearchParams, withLayoutContext } from 'expo-router'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Search } from '@/components/generic/atoms/Search'
import { Icon, IconNames } from '@/components/generic/atoms/Icon'
import { useCache } from '@/context/data/Cache'
import { EventDayDetails } from '@/context/data/types.details'
import { isSameDay } from 'date-fns'
import { useNow } from '@/hooks/time/useNow'

const { Navigator } = createMaterialTopTabNavigator()

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

  const now = useNow('static')

  const backgroundSurface = useThemeBackground('surface')

  const { eventDays } = useCache()

  const initialRouteName = getInitialRoute(eventDays, now)

  return (
    <MaterialTopTabs
      initialRouteName={initialRouteName}
      style={StyleSheet.absoluteFill}
      screenOptions={{ sceneStyle: backgroundSurface }}
      tabBar={(props) => (
        <View>
          <MaterialTopTabBar {...props} />
          <Search style={styles.search} filter={query || ''} setFilter={setFilter} />
        </View>
      )}
    >
      <MaterialTopTabs.Screen name="filter" options={createOptions('Filter', 'filter-variant')} />
      <MaterialTopTabs.Screen name="personal" options={createOptions('Personal', 'calendar-heart')} />
      <MaterialTopTabs.Screen name="day-1" options={createOptions(dayTabTitle(eventDays[0]))} redirect={eventDays.length < 1} />
      <MaterialTopTabs.Screen name="day-2" options={createOptions(dayTabTitle(eventDays[1]))} redirect={eventDays.length < 2} />
      <MaterialTopTabs.Screen name="day-3" options={createOptions(dayTabTitle(eventDays[2]))} redirect={eventDays.length < 3} />
      <MaterialTopTabs.Screen name="day-4" options={createOptions(dayTabTitle(eventDays[3]))} redirect={eventDays.length < 4} />
      <MaterialTopTabs.Screen name="day-5" options={createOptions(dayTabTitle(eventDays[4]))} redirect={eventDays.length < 5} />
      <MaterialTopTabs.Screen name="day-6" options={createOptions(dayTabTitle(eventDays[5]))} redirect={eventDays.length < 6} />
      <MaterialTopTabs.Screen name="day-7" options={createOptions(dayTabTitle(eventDays[6]))} redirect={eventDays.length < 7} />
    </MaterialTopTabs>
  )
}

const styles = StyleSheet.create({
  search: {
    marginVertical: 10,
  },
})
