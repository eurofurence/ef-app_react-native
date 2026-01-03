import { addMilliseconds, getHours, getMinutes } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

import { useCache } from '@/context/data/Cache'

/**
 * Returns the current time with a millisecond offset.
 * @param amount The ms offset.
 */
const nowWithOffset = (amount: number) => addMilliseconds(new Date(), amount)

/**
 * True if the values are equal in a given quantization.
 * @param a The first value.
 * @param b The second value.
 * @param resolution The resolution.
 */
const sameInResolution = (a: number, b: number, resolution: number) =>
  Math.floor(a / resolution) === Math.floor(b / resolution)

/**
 * Get the current date, which includes time travelling.
 * @param resolution Static if not live. Otherwise, gives the minute hand
 * precision of the clock. Starts an interval, so use in central places only.
 */
export const useNow = (resolution: 'static' | number = 'static'): Date => {
  const { getValue } = useCache()
  const settings = getValue('settings')
  const offset = settings.timeTravelEnabled
    ? (settings.timeTravelOffset ?? 0)
    : 0

  const [now, setNow] = useState(() => nowWithOffset(offset))

  useEffect(() => {
    setNow(nowWithOffset(offset))
    if (resolution === 'static') return

    const handle = setInterval(() => {
      setNow((current) => {
        const next = nowWithOffset(offset)
        const currentMinutes = getHours(current) * 60 + getMinutes(current)
        const nextMinutes = getHours(next) * 60 + getMinutes(next)
        return sameInResolution(currentMinutes, nextMinutes, resolution)
          ? current
          : next
      })
    }, 500)

    return () => clearInterval(handle)
  }, [offset, resolution])

  return now
}

/**
 * Returns a function that gets the current date with optional time travel offset.
 */
export function useGetNow(): () => Date {
  const { getValue } = useCache()
  const settings = getValue('settings')
  const offset = settings.timeTravelEnabled
    ? (settings.timeTravelOffset ?? 0)
    : 0
  return useCallback(() => addMilliseconds(new Date(), offset), [offset])
}
