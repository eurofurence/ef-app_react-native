import { isWithinInterval } from 'date-fns'
import { chain } from 'lodash'
import { useMemo } from 'react'

import { eventInstanceForAny } from '@/components/events/EventCard'
import { useCache } from '@/context/data/Cache'
import type { EventDetails } from '@/context/data/types.details'
import { useAppSetting } from '@/data/collections/AppSettings'

const filterCurrentEvents = (
  events: readonly EventDetails[],
  now: Date
): EventDetails[] =>
  events.filter((it) =>
    isWithinInterval(now, {
      start: it.Start,
      end: it.End,
    })
  )

/**
 * Uses the "event instances" for the currently active events.
 * @param now The current time.
 */
export function useCurrentEvents(now: Date) {
  const { events } = useCache()

  const [showInternal] = useAppSetting('ShowInternalEvents')
  return useMemo(
    () =>
      chain(filterCurrentEvents(events, now))
        .filter((item) => !item.Hidden && (showInternal || !item.IsInternal))
        .map((details) => eventInstanceForAny(details, now))
        .orderBy('progress', 'asc')
        .value(),
    [events, now, showInternal]
  )
}
