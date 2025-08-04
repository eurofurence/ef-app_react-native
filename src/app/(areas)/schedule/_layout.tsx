import { Icon, IconNames } from '@/components/generic/atoms/Icon'
import { Search } from '@/components/generic/atoms/Search'
import { useCache } from '@/context/data/Cache'
import { EventDayDetails } from '@/context/data/types.details'
import { ScheduleSearchContext } from '@/context/ScheduleSearchContext'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import type { MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs'
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs'
import type { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { isSameDay } from 'date-fns'
import { withLayoutContext } from 'expo-router'
import * as React from 'react'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const unstable_settings = {
  initialRouteName: 'day-1',
}

const { Navigator } = createMaterialTopTabNavigator()

const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions, typeof Navigator, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>(Navigator)

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
  const insets = useSafeAreaInsets()
  const now = useNow('static')
  const backgroundSurface = useThemeBackground('surface')
  const { eventDays } = useCache()
  const initialRouteName = getInitialRoute(eventDays, now)
  const [filter, setFilter] = useState('')

  return (
    <ScheduleSearchContext.Provider value={{ query: filter, setQuery: setFilter }}>
      <MaterialTopTabs
        initialRouteName={initialRouteName}
        style={StyleSheet.absoluteFill}
        screenOptions={{ sceneStyle: backgroundSurface, tabBarItemStyle: styles.tabItem }}
        tabBar={(props) => (
          <View style={[styles.tabBarContainer, { paddingTop: insets.top }]}>
            <MaterialTopTabBar {...props} />
            <Search style={styles.search} filter={filter} setFilter={setFilter} />
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
    </ScheduleSearchContext.Provider>
  )
}

const styles = StyleSheet.create({
  tabItem: {
    margin: 0,
    padding: 0,
  },
  tabBarContainer: {
    backgroundColor: 'transparent',
  },
  search: {
    marginVertical: 10,
  },
})
