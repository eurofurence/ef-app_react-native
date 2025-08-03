import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { isBefore, isSameDay } from 'date-fns'
import { EventCard, eventInstanceForAny } from './EventCard'
import { Section } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'
import { useEventLongPress } from '@/hooks/data/useEventReminder'

const filterHappeningTodayEvents = <T extends Pick<EventDetails, 'StartDateTimeUtc' | 'EndDateTimeUtc'>>(events: readonly T[], now: Date): T[] =>
  events.filter((it) => isSameDay(now, new Date(it.StartDateTimeUtc))).filter((it) => isBefore(now, new Date(it.EndDateTimeUtc)))

// Component for individual event card with long press functionality
const TodayEventCard = ({ event }: { event: any }) => {
  const { onLongPress } = useEventLongPress(event.details)

  return (
    <EventCard
      key={event.details.Id}
      event={event}
      type="time"
      onPress={(event) =>
        router.navigate({
          pathname: '/events/[id]',
          params: { id: event.Id },
        })
      }
      onLongPress={onLongPress}
    />
  )
}

export type TodayScheduleListProps = {
  now: Date
}

export const TodayScheduleList: FC<TodayScheduleListProps> = ({ now }) => {
  const { t } = useTranslation('Events')
  const { eventsFavorite } = useCache()

  const today = useMemo(() => {
    const favorites = eventsFavorite.filter((item) => !item.Hidden)

    return filterHappeningTodayEvents(favorites, now).map((details) => eventInstanceForAny(details, now))
  }, [eventsFavorite, now])

  if (today.length === 0) {
    return null
  }

  return (
    <>
      <Section title={t('today_schedule_title')} subtitle={t('today_schedule_subtitle')} icon="book-marker" />
      <View style={styles.condense}>
        {today.map((event) => (
          <TodayEventCard key={event.details.Id} event={event} />
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
