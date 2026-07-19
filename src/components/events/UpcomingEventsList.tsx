import {onLongPressEvent, onPressEvent} from "@/app/(areas)/schedule/day-1";
import {EventCard2} from "@/components/events/EventCard2";
import {conTimeZone} from "@/configuration";
import {type EfEventFull, eventsFullCollection} from "@/data/collections/content/EventsFull";
import {useNow} from "@/hooks/time/useNow";
import {isUndefined, not, or, useLiveQuery} from "@tanstack/react-db";
import { isWithinInterval, subMinutes } from 'date-fns'
import {toZonedTime} from "date-fns-tz";
import {useCallback} from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import {useAppSetting} from '@/data/collections/supplemental/AppSettings'
import { Section } from '../generic/atoms/Section'

export function UpcomingEventsList() {
  const {t} = useTranslation('Events')
  const now = useNow()
  const [showInternal] = useAppSetting('ShowInternalEvents')

  const upcomingFilter = useCallback((event: EfEventFull) => {
    const startDate = toZonedTime(event.StartDateTimeUtc, conTimeZone)
    const startMinus30 = subMinutes(startDate, 30)
    return isWithinInterval(now, {
      start: startMinus30,
      end: startDate
    });
  }, [now])

  const {data: upcoming} = useLiveQuery({
    id: 'upcoming-events',
    query: q => q.from({item: eventsFullCollection})
      .where(({item}) => isUndefined(item.Hidden))
      .where(({item}) => or(showInternal, not(item.IsInternal)))
      .orderBy(({item}) => item.StartDateTimeUtc)
      .fn.where(({item}) => upcomingFilter(item))
  }, [showInternal, upcomingFilter])

  if (upcoming.length === 0) {
    return null
  }

  return (
    <>
      <Section
        title={t('upcoming_title')}
        subtitle={t('upcoming_subtitle')}
        icon='clock'
      />
      <View style={styles.condense}>
        {upcoming.map((event) => (
          <EventCard2
            key={event.Id}
            event={event}
            type='duration'
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
