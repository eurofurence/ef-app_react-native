import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { isWithinInterval, subMinutes } from 'date-fns'
import { Section } from '../generic/atoms/Section'
import { EventCard, eventInstanceForAny } from './EventCard'
import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'
import { useEventCardInteractions } from '@/components/events/Events.common'
import { parseDefaultISO } from '@/util/parseDefaultISO'

const filterUpcomingEvents = (events: readonly EventDetails[], now: Date) =>
  events.filter((it) => {
    const startDate = parseDefaultISO(it.StartDateTimeUtc)
    const startMinus30 = subMinutes(startDate, 30)
    return isWithinInterval(now, { start: startMinus30, end: startDate })
  })

export type UpcomingEventsListProps = {
  now: Date
}
export const UpcomingEventsList: FC<UpcomingEventsListProps> = ({ now }) => {
  const { t } = useTranslation('Events')
  const { events } = useCache()

  const upcoming = useMemo(
    () =>
      filterUpcomingEvents(events, now)
        .filter((item) => !item.Hidden)
        .map((details) => eventInstanceForAny(details, now)),
    [events, now]
  )

  const { onPress, onLongPress } = useEventCardInteractions()

  if (upcoming.length === 0) {
    return null
  }

  return (
    <>
      <Section title={t('upcoming_title')} subtitle={t('upcoming_subtitle')} icon="clock" />
      <View style={styles.condense}>
        {upcoming.map((event) => (
          <EventCard key={event.details.Id} event={event} type="duration" onPress={onPress} onLongPress={onLongPress} />
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
