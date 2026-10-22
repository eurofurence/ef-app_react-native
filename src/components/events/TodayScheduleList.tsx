import { isUndefined, not, or, useLiveQuery } from '@tanstack/react-db'
import { isBefore, isSameDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { onLongPressEvent, onPressEvent } from '@/app/(areas)/schedule/day-1'
import { EventCard2 } from '@/components/events/EventCard2'
import { Section } from '@/components/generic/atoms/Section'
import { conTimeZone } from '@/configuration'
import {
  type EfEventFull,
  eventsFullCollection,
} from '@/data/collections/content/EventsFull'
import { useAppSetting } from '@/data/collections/supplemental/AppSettings'
import { useNow } from '@/hooks/time/useNow'

export const TodayScheduleList = () => {
  const { t } = useTranslation('Events')
  const now = useNow()

  const [showInternal] = useAppSetting('ShowInternalEvents')

  const todayFilter = useCallback(
    (event: EfEventFull) => {
      const start = toZonedTime(event.StartDateTimeUtc, conTimeZone)
      const end = toZonedTime(event.EndDateTimeUtc, conTimeZone)
      return (
        isBefore(now, end) && (isSameDay(now, start) || isSameDay(now, end))
      )
    },
    [now]
  )

  const { data: today } = useLiveQuery(
    {
      id: 'todays-schedule',
      query: (q) =>
        q
          .from({ item: eventsFullCollection })
          .where(({ item }) => isUndefined(item.Hidden))
          .where(({ item }) => not(isUndefined(item.Favorite)))
          .where(({ item }) => or(showInternal, not(item.IsInternal)))
          .orderBy(({ item }) => item.StartDateTimeUtc)
          .fn.where(({ item }) => todayFilter(item)),
    },
    [showInternal, todayFilter]
  )

  if (today.length === 0) {
    return null
  }

  return (
    <>
      <Section
        title={t('today_schedule_title')}
        subtitle={t('today_schedule_subtitle')}
        icon='book-marker'
      />
      <View style={styles.condense}>
        {today.map((event) => (
          <EventCard2
            key={event.Id}
            event={event}
            type='time'
            onPress={onPressEvent}
            onLongPress={onLongPressEvent}
          />
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
