import { appStyles } from '@/components/AppStyles'
import { RecentAnnouncements } from '@/components/announce/RecentAnnouncements'
import { CurrentEventList } from '@/components/events/CurrentEventsList'
import { TodayScheduleList } from '@/components/events/TodayScheduleList'
import { UpcomingEventsList } from '@/components/events/UpcomingEventsList'
import { Search } from '@/components/generic/atoms/Search'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { CountdownHeader } from '@/components/home/CountdownHeader'
import { DeviceSpecificWarnings } from '@/components/home/DeviceSpecificWarnings'
import { FavoritesChangedWarning } from '@/components/home/FavoritesChangedWarning'
import { GlobalSearch } from '@/components/home/GlobalSearch'
import { LanguageWarnings } from '@/components/home/LanguageWarnings'
import { RegistrationCountdown } from '@/components/home/RegistrationCountdown'
import { TimezoneWarning } from '@/components/home/TimezoneWarning'
import { registrationUrl } from '@/configuration'
import { useCache } from '@/context/data/Cache'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { vibrateAfter } from '@/util/vibrateAfter'
import { useIsFocused } from '@react-navigation/core'
import React, { useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet } from 'react-native'

export default function Index() {
  const isFocused = useIsFocused()
  const now = useNow(isFocused ? 5 : 'static')
  const { synchronize, isSynchronizing } = useCache()
  const backgroundSurface = useThemeBackground('surface')

  const [filter, setFilter] = useState('')

  // Search integration.
  const globalIndex = useCache().searchGlobal
  const results = useFuseResults(globalIndex, filter, 15)

  return (
    <ScrollView style={[StyleSheet.absoluteFill, backgroundSurface]} refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={() => vibrateAfter(synchronize())} />}>
      <CountdownHeader />
      <Search filter={filter} setFilter={setFilter} />
      <RegistrationCountdown registrationUrl={registrationUrl} />
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
