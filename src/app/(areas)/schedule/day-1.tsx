import {
  eq,
  inArray,
  isUndefined,
  not,
  or,
  useLiveQuery,
} from '@tanstack/react-db'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { EventCard2 } from '@/components/events/EventCard2'
import { EventSection } from '@/components/events/EventSection'
import type { IconNames } from '@/components/generic/atoms/Icon'
import { Label } from '@/components/generic/atoms/Label'
import { EfSectionList } from '@/components/generic/lists/EfLists'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { daysCollection } from '@/data/collections/content/Days'
import {
  type EfEventFull,
  eventsFullCollection,
} from '@/data/collections/content/EventsFull'
import { useAppSetting } from '@/data/collections/supplemental/AppSettings'
import { favoriteEventsToggle } from '@/data/collections/supplemental/FavoriteEvents'
import { synchronize, useIsSynchronizing } from '@/data/hooks/useSynchronize'
import type { EfDay } from '@/data/types/EfDay'
import { deriveCategorizedTime } from '@/data/utils/deriveCategorizedTime'
import { collectBy, orderBy } from '@/util/arrays'
import { vibrateAfter } from '@/util/vibrateAfter'

function isLong(duration: string | undefined) {
  return duration && duration > '04:00:00'
}

export function onPressEvent(event: EfEventFull) {
  router.navigate({
    pathname: '/events/[id]',
    params: { id: event.Id },
  })
}

export function onLongPressEvent(event: EfEventFull) {
  favoriteEventsToggle(event.Id)
}

export function DayView({ day }: { day: EfDay }) {
  const { results } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const isSynchronizing = useIsSynchronizing()

  const [showInternal] = useAppSetting('ShowInternalEvents')

  const { data: events } = useLiveQuery(
    {
      id: `area-schedule-${day.Id}`,
      query: (q) =>
        q
          .from({ item: eventsFullCollection })
          .where(({ item }) => eq(item.ConferenceDayId, day.Id))
          .where(({ item }) => isUndefined(item.Hidden))
          .where(({ item }) => or(showInternal, not(item.IsInternal)))
          .where(({ item }) => or(!results, inArray(item.Id, results)))
          .orderBy(({ item }) => item.StartDateTimeUtc),
    },
    [day.Id, showInternal, results]
  )

  const { data: hidden } = useLiveQuery(
    {
      id: `area-schedule-${day.Id}-hidden`,
      query: (q) =>
        q
          .from({ item: eventsFullCollection })
          .where(({ item }) => eq(item.ConferenceDayId, day.Id))
          .where(({ item }) => or(showInternal, not(item.IsInternal)))
          .where(({ item }) => not(isUndefined(item.Hidden)))
          .where(({ item }) => or(!results, inArray(item.Id, results))),
    },
    [day.Id, showInternal, results]
  )

  const grouping = useMemo(() => {
    const sorted = orderBy(events, (a) => (isLong(a.Duration) ? 0 : 1))
    return collectBy(sorted, (a) =>
      isLong(a.Duration)
        ? 'long_running'
        : deriveCategorizedTime(a.StartDateTimeUtc)
    )
  }, [events])

  const listHeaderComponent = (
    <View>
      <Label type='lead' variant='middle'>
        {day?.Name ?? ''}
      </Label>
      <Label type='lead' variant='middle'>
        {day?.Date.split('T')[0] ?? ''}
      </Label>
    </View>
  )

  const listFooterComponent =
    hidden.length > 0 ? (
      <Label type='lead' variant='middle'>
        {t('events_hidden_subtitle', { count: hidden.length })}
      </Label>
    ) : null

  return (
    <EfSectionList<string, EfEventFull>
      refreshing={isSynchronizing}
      onRefresh={() => vibrateAfter(synchronize())}
      scrollEnabled={true}
      contentContainerClassName='pb-32'
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={listFooterComponent}
      data={grouping}
      renderSection={({ item }) => {
        const title = t(item)
        const icon = ((item === 'morning' && 'weather-sunset-up') ||
          (item === 'afternoon' && 'weather-sunny') ||
          (item === 'evening' && 'weather-sunset-down') ||
          (item === 'night' && 'weather-night') ||
          (item === 'long_running' && 'calendar-range') ||
          'weather-sunny') as IconNames
        return <EventSection style={styles.item} title={title} icon={icon} />
      }}
      renderItem={({ item }) => {
        return (
          <EventCard2
            containerStyle={styles.item}
            event={item}
            onPress={onPressEvent}
            onLongPress={onLongPressEvent}
          />
        )
      }}
      accessibilityLabel={t('events_list', { defaultValue: 'Events list' })}
    />
  )
}

export function DayViewByNumber({ dayNumber }: { dayNumber: number }) {
  const { data: day } = useLiveQuery({
    id: `area-schedule-days-${dayNumber}`,
    query: (q) =>
      q
        .from({ day: daysCollection })
        .orderBy(({ day }) => day.Date)
        .offset(dayNumber)
        .findOne(),
  })

  return day ? <DayView day={day} /> : null
}

export default function Day1() {
  return <DayViewByNumber dayNumber={0} />
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
