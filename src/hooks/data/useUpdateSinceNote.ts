import { isAfter } from 'date-fns'
import { useEffect, useMemo } from 'react'

import { useCache } from '@/context/data/Cache'
import { RecordMetadata } from '@/context/data/types.api'
import { useNow } from '@/hooks/time/useNow'
import { parseDefaultISO } from '@/util/parseDefaultISO'

/**
 * Gets the last viewed time of this record and if the record has changed
 * since, returns true. Also connects setting the viewed time of the item after
 * a delay.
 * @param item The item or null or undefined if not yet loaded.
 * @param delay The delay before setting as viewed.
 */
export const useUpdateSinceNote = (item: RecordMetadata | null | undefined, delay = 3_000) => {
  const now = useNow('static')
  const { data, setValue } = useCache()
  const lastViewed = item ? (data.settings.lastViewTimes?.[item.Id] ?? null) : null

  const updated = useMemo(() => Boolean(item && lastViewed && isAfter(parseDefaultISO(item.LastChangeDateTimeUtc), parseDefaultISO(lastViewed))), [item, lastViewed])

  useEffect(() => {
    if (!item) return

    const timeoutId = setTimeout(
      () =>
        setValue('settings', (current) => ({
          ...current,
          lastViewTimes: {
            ...(current.lastViewTimes ?? {}),
            [item.Id]: now.toISOString(),
          },
        })),
      delay
    )
    return () => {
      clearTimeout(timeoutId)
    }
  }, [item, delay, now, setValue])

  return updated
}
