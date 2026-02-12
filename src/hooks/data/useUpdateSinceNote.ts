import { isAfter } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

import { useCache } from '@/context/data/Cache'
import type { RecordMetadata } from '@/context/data/types.api'
import { useGetNow } from '@/hooks/time/useNow'
import { parseDefaultISO } from '@/util/parseDefaultISO'

/**
 * Gets the last viewed time of this record and if the record has changed
 * since, returns true. Also connects setting the viewed time of the item after
 * a delay.
 * @param item The item or null or undefined if not yet loaded.
 * @param delay The delay before setting as viewed.
 */
export const useUpdateSinceNote = (
  item: RecordMetadata | null | undefined,
  delay = 500
) => {
  const [invoked, setInvoked] = useState(false)
  const getNow = useGetNow()
  const { getValue, setValue } = useCache()
  const settings = getValue('settings')
  const lastViewed = item ? (settings.lastViewTimes?.[item.Id] ?? null) : null

  const updated = useMemo(
    () =>
      Boolean(
        item &&
          lastViewed &&
          isAfter(
            parseDefaultISO(item.LastChangeDateTimeUtc),
            parseDefaultISO(lastViewed)
          )
      ),
    [item, lastViewed]
  )
  useEffect(() => {
    // Item not given yet or already invoked: skip.
    if (!item?.Id) return
    if (invoked) return

    // Set after a timeout.
    const timeoutId = setTimeout(() => {
      // Mark as invoked and update the last viewed time to current time.
      setInvoked(true)
      setValue('settings', {
        ...settings,
        lastViewTimes: {
          ...(settings.lastViewTimes ?? {}),
          [item.Id]: getNow().toISOString(),
        },
      })
    }, delay)

    // If something has changed, clear the timeout. It might have already run, but then, invoked is also set.
    return () => {
      clearTimeout(timeoutId)
    }
  }, [item?.Id, invoked, setValue, settings, getNow, delay])

  return updated
}
