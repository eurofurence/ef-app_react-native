import { Redirect, router, useLocalSearchParams, usePathname } from 'expo-router'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { Route, TabBar, TabView } from 'react-native-tab-view'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { TabLabel } from '@/components/generic/atoms/TabLabel'
import { EventDayDetails } from '@/context/data/types'
import { Search } from '@/components/generic/atoms/Search'
import { IconNames } from '@/components/generic/atoms/Icon'
import { useDataState } from '@/context/data/DataState'
import { PersonalView } from '@/components/schedule/PersonalView'
import { FilterView } from '@/components/schedule/FilterView'
import { DayView } from '@/components/schedule/DayView'

function dayTabTitle(day: EventDayDetails) {
    const date = new Date(day.Date)
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
}

export const scheduleRoutePrefix = '/schedule/'

/**
 * Customized route data for unified icon rendering handling.
 */
type TabViewRoute = Route & { icon?: IconNames, lazy?: boolean };

export default function EventsScreen() {
    const pathname = usePathname()
    const { query } = useLocalSearchParams<{ query?: string }>()

    const key = pathname.startsWith(scheduleRoutePrefix) ? pathname.substring(scheduleRoutePrefix.length) : null
    const { eventDays } = useDataState()

    const routes = useMemo(
        (): TabViewRoute[] => [
            { key: 'filter', title: 'Filter', icon: 'filter-variant', lazy: true },
            { key: 'personal', title: 'Personal', icon: 'calendar-heart' },
            ...eventDays.map(item => ({ key: item.Id, title: dayTabTitle(item) })),
        ],
        [eventDays])

    const index = Math.max(0, routes.findIndex(item => item.key === key))

    const renderScene = useCallback(({ route }: { route: Route }) => {
        if (route.key === 'filter') return <FilterView key={route.key} />
        if (route.key === 'personal') return <PersonalView key={route.key} />
        const item = eventDays.find(item => item.Id == route.key)
        if (!item) return null
        return <DayView day={item} key={route.key} />
    }, [eventDays])

    const layout = useWindowDimensions()

    const backgroundSurface = useThemeBackground('surface')
    const backgroundBackground = useThemeBackground('background')
    const backgroundSecondary = useThemeBackground('secondary')


    if (!eventDays?.length)
        return null
    if (key == null)
        return <Redirect href={scheduleRoutePrefix + eventDays[0].Id} />

    return (
        <TabView
            style={StyleSheet.absoluteFill}
            sceneContainerStyle={backgroundSurface}
            lazy={props => Boolean(props.route.lazy)}
            renderTabBar={(props) =>
                <View key="tabbar">
                    <TabBar {...props}
                            renderLabel={({ focused, route }) =>
                                <TabLabel focused={focused} icon={route.icon} title={route.title} />}
                            style={backgroundBackground}
                            indicatorStyle={backgroundSecondary}
                            onTabPress={(props) => {
                                // Replace tab press handling with immediate router navigation.
                                // Index-change handler will handle nothing in this case.
                                router.replace((scheduleRoutePrefix + props.route.key) as string)
                                props.preventDefault()
                            }}
                            tabStyle={{ width: layout.width / routes.length }} />
                    <Search style={styles.search} filter={query || ''} setFilter={value => router.setParams({ query: value })} />
                </View>}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={() => undefined}
            initialLayout={{ width: layout.width }}
        />
    )
}

const styles = StyleSheet.create({
    search: {
        marginVertical: 10,
    },
})
