import { useMemo } from 'react'
import { chain } from 'lodash'
import { isWithinInterval, parseISO } from 'date-fns'
import { eventInstanceForAny } from '@/components/events/EventCard'
import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'

const filterCurrentEvents = <T extends Pick<EventDetails, 'StartDateTimeUtc' | 'EndDateTimeUtc'>>(events: readonly T[], now: Date): T[] =>
  events.filter((it) =>
    isWithinInterval(now, {
      start: parseISO(it.StartDateTimeUtc),
      end: parseISO(it.EndDateTimeUtc),
    })
  )

/**
 * Uses the "event instances" for the currently active events.
 * @param now The current time.
 */
export function useCurrentEvents(now: Date) {
  const { events } = useCache()

  return useMemo(
    () =>
      chain(filterCurrentEvents(events, now))
        .filter((item) => !item.Hidden)
        .map((details) => eventInstanceForAny(details, now))
        .orderBy('progress', 'asc')
        .value(),
    [events, now]
  )
}
