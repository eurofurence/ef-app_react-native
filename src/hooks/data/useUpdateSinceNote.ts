import { isAfter } from 'date-fns'
import {useEffect, useState} from 'react'

import { getNow } from '@/hooks/time/useNow'
import {eq, useLiveQuery} from '@tanstack/react-db'
import {lastViewTimesCollection, lastViewTimesUpdate} from '@/data/collections/supplemental/LastViewTimes'
import type {EfEntity} from '@/data/types/EfEntity'
import {useLatchTrue} from '@/hooks/util/useLatchTrue'

export function useViewTrackingUpdate(entity: EfEntity, delay = 500) {
  // On use time and "invoked" latch.
  const [viewTime] = useState(() => getNow())
  const [invoked, setInvoked] = useState(false)

  useEffect(() => {
    // Item not given yet or already invoked: skip.
    if (invoked) return

    // Set after a timeout.
    const timeoutId = setTimeout(() => {
      // Mark as invoked and update the last viewed time to current time.
      setInvoked(true)
      lastViewTimesUpdate(entity.Id, viewTime)
    }, delay)

    // If something has changed, clear the timeout. It might have already run, but then, invoked is also set.
    return () => {
      clearTimeout(timeoutId)
    }
  }, [viewTime, entity.Id])
}

export function useViewTrackingState(entity: EfEntity) {
  // Resolve source view entry.
  const {data: view, isReady} = useLiveQuery({
    id: `entity-last-view-${entity.Id}`,
    query: q => q.from({entry: lastViewTimesCollection})
      .where(({entry}) => eq(entry.Id, entity.Id))
      .findOne()
  }, [entity.Id])

  // Result is updated.
  const updated = Boolean(isReady && view && isAfter(entity.LastChangeDateTimeUtc, view.Time))

  return useLatchTrue(updated)
}
