import { Redirect, router, useLocalSearchParams, usePathname } from 'expo-router'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { Route, TabBar, TabView } from 'react-native-tab-view'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { isSameDay } from 'date-fns'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { TabLabel } from '@/components/generic/atoms/TabLabel'
import { EventDayDetails } from '@/context/data/types'
import { Search } from '@/components/generic/atoms/Search'
import { IconNames } from '@/components/generic/atoms/Icon'
import { useCache } from '@/context/data/Cache'
import { PersonalView } from '@/components/schedule/PersonalView'
import { FilterView } from '@/components/schedule/FilterView'
import { DayView } from '@/components/schedule/DayView'
import { useNow } from '@/hooks/time/useNow'

function dayTabTitle(day: EventDayDetails) {
  const date = new Date(day.Date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
}

export const scheduleRoutePrefix = '/schedule/'

/**
 * Customized route data for unified icon rendering handling.
 */
type TabViewRoute = Route & { icon?: IconNames }

function setFilter(value: string) {
  router.setParams({ query: value })
}

export default function EventsScreen() {
  const pathname = usePathname()
  const { query } = useLocalSearchParams<{ query?: string }>()

  const key = pathname.startsWith(scheduleRoutePrefix) ? pathname.substring(scheduleRoutePrefix.length) : null
  const now = useNow('static')
  const { eventDays } = useCache()

  const routes = useMemo(
    (): TabViewRoute[] => [
      { key: 'filter', title: 'Filter', icon: 'filter-variant' },
      { key: 'personal', title: 'Personal', icon: 'calendar-heart' },
      ...eventDays.map((item) => ({ key: item.Id, title: dayTabTitle(item) })),
    ],
    [eventDays]
  )

  const index = Math.max(
    0,
    routes.findIndex((item) => item.key === key)
  )

  const renderScene = useCallback(
    ({ route }: { route: Route }) => {
      if (route.key === 'filter') return <FilterView />
      if (route.key === 'personal') return <PersonalView />
      const item = eventDays.find((item) => item.Id === route.key)
      if (!item) return null
      return <DayView day={item} />
    },
    [eventDays]
  )

  const layout = useWindowDimensions()
  const tabStyle = useMemo(() => ({ width: layout.width / routes.length }), [layout.width, routes.length])
  const initialLayout = useMemo(() => ({ width: layout.width }), [layout.width])

  const backgroundSurface = useThemeBackground('surface')
  const backgroundBackground = useThemeBackground('background')
  const backgroundSecondary = useThemeBackground('secondary')

  if (!eventDays.length) {
    return null
  }

  // Key wasn't found. Redirect to a proper route.
  if (key == null) {
    const target = eventDays.find((item) => isSameDay(now, item.Date)) ?? eventDays[0]
    return <Redirect href={scheduleRoutePrefix + target.Id} />
  }

  return (
    <TabView<TabViewRoute>
      style={StyleSheet.absoluteFill}
      sceneContainerStyle={backgroundSurface}
      renderTabBar={(props) => (
        <View>
          <TabBar
            {...props}
            key="tabbar"
            style={backgroundBackground}
            indicatorStyle={backgroundSecondary}
            tabStyle={tabStyle}
            renderLabel={({ focused, route }) => <TabLabel focused={focused} icon={route.icon} title={route.title} />}
            onTabPress={(props) => {
              // Replace tab press handling with immediate router navigation.
              // Index-change handler will handle nothing in this case.
              router.replace((scheduleRoutePrefix + props.route.key) as string)
              props.preventDefault()
            }}
          />
          <Search style={styles.search} filter={query || ''} setFilter={setFilter} />
        </View>
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={() => undefined}
      initialLayout={initialLayout}
    />
  )
}

const styles = StyleSheet.create({
  search: {
    marginVertical: 10,
  },
})
