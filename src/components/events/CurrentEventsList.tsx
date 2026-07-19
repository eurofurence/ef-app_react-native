import { isUndefined, not, or, useLiveQuery } from '@tanstack/react-db'
import { isWithinInterval } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { onLongPressEvent, onPressEvent } from '@/app/(areas)/schedule/day-1'
import { EventCard2 } from '@/components/events/EventCard2'
import { conTimeZone } from '@/configuration'
import {
  type EfEventFull,
  eventsFullCollection,
} from '@/data/collections/content/EventsFull'
import { useAppSetting } from '@/data/collections/supplemental/AppSettings'
import { useNow } from '@/hooks/time/useNow'
import { orderBy } from '@/util/arrays'
import { getProgress } from '@/util/eventTiming'

import { Section } from '../generic/atoms/Section'

export function CurrentEventList() {
  const { t } = useTranslation('Events')
  const now = useNow()
  const [showInternal] = useAppSetting('ShowInternalEvents')

  const currentFilter = useCallback(
    (event: EfEventFull) => {
      return isWithinInterval(now, {
        start: toZonedTime(event.StartDateTimeUtc, conTimeZone),
        end: toZonedTime(event.EndDateTimeUtc, conTimeZone),
      })
    },
    [now]
  )

  const { data: events } = useLiveQuery(
    {
      id: 'current-events',
      query: (q) =>
        q
          .from({ item: eventsFullCollection })
          .where(({ item }) => isUndefined(item.Hidden))
          .where(({ item }) => or(showInternal, not(item.IsInternal)))
          .fn.where(({ item }) => currentFilter(item)),
    },
    [showInternal, currentFilter]
  )

  const current = useMemo(() => {
    return orderBy(events, (event) => getProgress(event, now))
  }, [events, now])

  if (current.length === 0) {
    return null
  }

  return (
    <>
      <Section
        title={t('current_title')}
        subtitle={t('current_subtitle')}
        icon='clock'
      />
      <View style={styles.condense}>
        {current.map((event) => (
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
