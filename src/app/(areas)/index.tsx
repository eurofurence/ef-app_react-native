import { StyleSheet } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/core'
import React, { useState } from 'react'
import { CountdownHeader } from '@/components/home/CountdownHeader'
import { Search } from '@/components/generic/atoms/Search'
import { useNow } from '@/hooks/time/useNow'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { LanguageWarnings } from '@/components/home/LanguageWarnings'
import { appStyles } from '@/components/AppStyles'
import { RecentAnnouncements } from '@/components/announce/RecentAnnouncements'
import { GlobalSearch } from '@/components/home/GlobalSearch'
import { DeviceSpecificWarnings } from '@/components/home/DeviceSpecificWarnings'
import { TimezoneWarning } from '@/components/home/TimezoneWarning'
import { FavoritesChangedWarning } from '@/components/home/FavoritesChangedWarning'
import { UpcomingEventsList } from '@/components/events/UpcomingEventsList'
import { TodayScheduleList } from '@/components/events/TodayScheduleList'
import { CurrentEventList } from '@/components/events/CurrentEventsList'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useCache } from '@/context/data/Cache'

export default function Index() {
    const isFocused = useIsFocused()
    const now = useNow(isFocused ? 5 : 'static')
    const { synchronizeUi, isSynchronizing } = useCache()
    const backgroundSurface = useThemeBackground('surface')

    const [filter, setFilter] = useState('')

    // Search integration.
    const globalIndex = useCache().searchGlobal
    const results = useFuseResults(globalIndex, filter, 15)

    return (
        <ScrollView
            style={[StyleSheet.absoluteFill, backgroundSurface]}
            refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={synchronizeUi} />}>
            <CountdownHeader />
            <Search filter={filter} setFilter={setFilter} />
            <Floater contentStyle={appStyles.trailer}>
                <LanguageWarnings parentPad={padFloater} />
                <TimezoneWarning parentPad={padFloater} />
                <DeviceSpecificWarnings />
                <FavoritesChangedWarning />
                {results ? (
                    <GlobalSearch now={now} results={results} />
                ) : (
                    <>
                        <RecentAnnouncements now={now} />
                        <UpcomingEventsList now={now} />
                        <TodayScheduleList now={now} />
                        <CurrentEventList now={now} />
                    </>
                )}
            </Floater>
        </ScrollView>
    )
}
