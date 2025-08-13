import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { isBefore, isSameDay } from 'date-fns'
import { EventCard, eventInstanceForAny } from './EventCard'
import { Section } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'
import { useEventCardInteractions } from '@/components/events/Events.common'

const filterHappeningTodayEvents = <T extends Pick<EventDetails, 'StartDateTimeUtc' | 'EndDateTimeUtc'>>(events: readonly T[], now: Date): T[] =>
  events.filter((it) => isSameDay(now, new Date(it.StartDateTimeUtc))).filter((it) => isBefore(now, new Date(it.EndDateTimeUtc)))

export type TodayScheduleListProps = {
  now: Date
}

export const TodayScheduleList: FC<TodayScheduleListProps> = ({ now }) => {
  const { t } = useTranslation('Events')
  const { eventsFavorite, getValue } = useCache()

  const showInternal = getValue('settings').showInternalEvents ?? true
  const today = useMemo(() => {
    const favorites = eventsFavorite.filter((item) => !item.Hidden && (showInternal || !item.IsInternal))

    return filterHappeningTodayEvents(favorites, now).map((details) => eventInstanceForAny(details, now))
  }, [eventsFavorite, now, showInternal])

  const { onPress, onLongPress } = useEventCardInteractions()

  if (today.length === 0) {
    return null
  }

  return (
    <>
      <Section title={t('today_schedule_title')} subtitle={t('today_schedule_subtitle')} icon="book-marker" />
      <View style={styles.condense}>
        {today.map((event) => (
          <EventCard key={event.details.Id} event={event} type="time" onPress={onPress} onLongPress={onLongPress} />
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  condense: {
    marginVertical: -15,
  },
})
