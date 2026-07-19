import { useLiveQuery } from '@tanstack/react-db'
import { isSameDay } from 'date-fns'
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
import { ShowInternalEventsToggle } from '@/components/events/ShowInternalEventsToggle'
import { Icon, type IconNames } from '@/components/generic/atoms/Icon'
import { Search } from '@/components/generic/atoms/Search'
import { ComingSoon } from '@/components/generic/containers/ComingSoon'
import { conName } from '@/configuration'
import { ScheduleSearchContext } from '@/context/ScheduleSearchContext'
import { daysCollection } from '@/data/collections/content/Days'
import { eventsFullCollection } from '@/data/collections/content/EventsFull'
import { useSearchIds } from '@/data/searching/useSearch'
import type { EfDay } from '@/data/types/EfDay'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { getNow } from '@/hooks/time/useNow'

export const unstable_settings = {
  initialRouteName: 'day-1',
}

const { Navigator } = createMaterialTopTabNavigator()

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

function getInitialRoute(days: readonly EfDay[], now: Date) {
  if (!days?.length) return undefined
  const today = days.findIndex((item) => isSameDay(now, item.Date))
  return today >= 0 ? `day-${today + 1}` : 'day-1'
}

function dayTabTitle(day: EfDay | undefined) {
  if (!day) return undefined
  const date = new Date(day.Date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
}

export default function ScheduleLayout() {
  const { t } = useTranslation('Events')
  const insets = useSafeAreaInsets()
  const backgroundSurface = useThemeBackground('surface')
  const { data: events, isReady } = useLiveQuery(eventsFullCollection)
  const { data: days } = useLiveQuery(daysCollection)
  const initialRouteName = getInitialRoute(days, getNow())
  const [query, setQuery] = useState('')
  const results = useSearchIds(eventsFullCollection, query)

  const options = useMemo(() => {
    return {
      filter: createOptions('Filter', 'filter-variant'),
      personal: createOptions('Personal', 'calendar-heart'),
      'day-1': createOptions(dayTabTitle(days[0])),
      'day-2': createOptions(dayTabTitle(days[1])),
      'day-3': createOptions(dayTabTitle(days[2])),
      'day-4': createOptions(dayTabTitle(days[3])),
      'day-5': createOptions(dayTabTitle(days[4])),
      'day-6': createOptions(dayTabTitle(days[5])),
      'day-7': createOptions(dayTabTitle(days[6])),
    }
  }, [days])

  if (isReady && events.length === 0)
    return (
      <ComingSoon
        image={require('@/assets/static/events-empty.png')}
        title={t('coming_soon_title')}
        text={t('coming_soon_body', { conName })}
      />
    )

  return (
    <ScheduleSearchContext.Provider value={{ query, setQuery, results }}>
      <MaterialTopTabs
        initialRouteName={initialRouteName}
        style={StyleSheet.absoluteFill}
        screenOptions={{
          tabBarStyle: { paddingTop: insets.top },
          sceneStyle: backgroundSurface,
          tabBarItemStyle: styles.tabItem,
        }}
        tabBar={(props: MaterialTopTabBarProps) => (
          <View style={styles.tabBarContainer}>
            <MaterialTopTabBar {...props} />
            <View className='flex-row items-center pr-2.5'>
              <Search
                className='flex-1 my-2.5 ml-2.5 mr-0'
                filter={query}
                setFilter={setQuery}
                placeholder={t('search.placeholder')}
              />
              <ShowInternalEventsToggle />
            </View>
          </View>
        )}
      >
        <MaterialTopTabs.Screen name='filter' options={options.filter} />
        <MaterialTopTabs.Screen name='personal' options={options.personal} />
        <MaterialTopTabs.Screen
          name='day-1'
          options={options['day-1']}
          redirect={days.length < 1}
        />
        <MaterialTopTabs.Screen
          name='day-2'
          options={options['day-2']}
          redirect={days.length < 2}
        />
        <MaterialTopTabs.Screen
          name='day-3'
          options={options['day-3']}
          redirect={days.length < 3}
        />
        <MaterialTopTabs.Screen
          name='day-4'
          options={options['day-4']}
          redirect={days.length < 4}
        />
        <MaterialTopTabs.Screen
          name='day-5'
          options={options['day-5']}
          redirect={days.length < 5}
        />
        <MaterialTopTabs.Screen
          name='day-6'
          options={options['day-6']}
          redirect={days.length < 6}
        />
        <MaterialTopTabs.Screen
          name='day-7'
          options={options['day-7']}
          redirect={days.length < 7}
        />
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
  toggle: {
    height: 44,
    width: 44,
    marginLeft: 6,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  toggleDisabled: {
    opacity: 0.4,
  },
})
