import { appStyles } from '@/components/AppStyles'
import { RecentAnnouncements } from '@/components/announce/RecentAnnouncements'
import { CurrentEventList } from '@/components/events/CurrentEventsList'
import { TodayScheduleList } from '@/components/events/TodayScheduleList'
import { UpcomingEventsList } from '@/components/events/UpcomingEventsList'
import { Search } from '@/components/generic/atoms/Search'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
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
import { useToastContext } from '@/context/ui/ToastContext'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { vibrateAfter } from '@/util/vibrateAfter'
import { useIsFocused } from '@react-navigation/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ShowInternalEventsToggle } from '@/components/events/ShowInternalEventsToggle'

export default function Index() {
  const { t } = useTranslation('Home')
  const { t: a11y } = useTranslation('Accessibility')
  const isFocused = useIsFocused()
  const now = useNow(isFocused ? 5 : 'static')
  const { synchronize, isSynchronizing, getValue } = useCache()
  const { toast } = useToastContext()
  const backgroundSurface = useThemeBackground('surface')

  const [filter, setFilter] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const showInternal = getValue('settings').showInternalEvents ?? true

  // Search integration.
  const globalIndex = useCache().searchGlobal
  const results = useFuseResults(globalIndex, filter, 15)?.filter((item) => {
    return item.type !== 'event' || (!item.Hidden && (showInternal || !item.IsInternal))
  })

  // Focus management for search results
  const searchResultsRef = useAccessibilityFocus<View>(300)

  // Status messages for accessibility feedback
  const statusMessage = useMemo(() => {
    if (isSynchronizing) {
      return t('status.refreshing', { defaultValue: 'Refreshing content...' })
    }
    if (filter && results) {
      const count = results.length
      if (count === 0) {
        return t('status.no_search_results', {
          defaultValue: 'No results found for "{{query}}"',
          query: filter,
        })
      }
      return t('status.search_results', {
        defaultValue: 'Found {{count}} result{{s}} for "{{query}}"',
        count,
        s: count === 1 ? '' : 's',
        query: filter,
      })
    }
    if (isInitialLoad && !isSynchronizing) {
      return a11y('content_loaded')
    }
    return ''
  }, [isSynchronizing, filter, results, isInitialLoad, t, a11y])

  // Handle search feedback
  useEffect(() => {
    if (filter) {
      const timer = setTimeout(() => {
        setSearchMessage(statusMessage)
      }, 300) // Debounce search announcements
      return () => clearTimeout(timer)
    } else {
      setSearchMessage('')
    }
  }, [filter, statusMessage])

  // Handle initial load completion
  useEffect(() => {
    if (!isSynchronizing && isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isSynchronizing, isInitialLoad])

  // Refresh handler with accessibility feedback
  const handleRefresh = async () => {
    try {
      setErrorMessage('') // Clear any previous errors
      await vibrateAfter(synchronize())
    } catch (error) {
      console.error('Refresh failed:', error)
      const errorMsg = t('status.refresh_failed', {
        defaultValue: 'Failed to refresh content. Please try again.',
      })
      setErrorMessage(errorMsg)
      toast('error', errorMsg)
    }
  }

  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, backgroundSurface]}
      refreshControl={
        <RefreshControl
          refreshing={isSynchronizing}
          onRefresh={handleRefresh}
          accessibilityLabel={a11y('pull_to_refresh')}
          accessibilityHint={a11y('pull_to_refresh_hint')}
          accessibilityRole="button"
          accessibilityState={{
            busy: isSynchronizing,
            disabled: isSynchronizing,
          }}
        />
      }
      accessibilityLabel={a11y('main_content')}
    >
      {/* Status messages for screen reader announcements */}
      <StatusMessage
        message={statusMessage}
        type="polite"
        visible={false} // Hidden but announced to screen readers
      />

      <StatusMessage
        message={searchMessage}
        type="polite"
        visible={false} // Hidden but announced to screen readers
      />

      {/* Error messages with assertive announcements */}
      <StatusMessage
        message={errorMessage}
        type="assertive"
        visible={false} // Hidden but announced to screen readers
      />

      <CountdownHeader />

      {/* Enhanced search with accessibility improvements */}
      <View className="px-1">
        <View className="flex-row items-center pr-2.5">
          <Search className="flex-1 my-2.5 ml-2.5 mr-0" filter={filter} setFilter={setFilter} placeholder={t('search.placeholder')} />
          <ShowInternalEventsToggle />
        </View>

        {/* Visual search status for sighted users */}
        {!filter ? null : (
          <View style={styles.searchStatus}>
            <Text style={styles.searchStatusText}>
              {results?.length === 0
                ? t('search.no_results', { defaultValue: 'No results found' })
                : t('search.results_count', {
                    defaultValue: '{{count}} result{{s}}',
                    count: results?.length || 0,
                    s: results?.length === 1 ? '' : 's',
                  })}
            </Text>
          </View>
        )}
      </View>

      <Floater contentStyle={appStyles.trailer}>
        <LanguageWarnings parentPad={padFloater} />
        <TimezoneWarning parentPad={padFloater} />
        <DeviceSpecificWarnings />
        <FavoritesChangedWarning />
        {results ? null : <RegistrationCountdown registrationUrl={registrationUrl} />}

        {results ? (
          <View ref={searchResultsRef} accessibilityLabel={t('accessibility.search_results')}>
            <GlobalSearch now={now} results={results} />
          </View>
        ) : (
          <View accessibilityLabel={a11y('main_sections')}>
            <RecentAnnouncements now={now} />
            <UpcomingEventsList now={now} />
            <TodayScheduleList now={now} />
            <CurrentEventList now={now} />
          </View>
        )}
      </Floater>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  searchStatus: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchStatusText: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
})
