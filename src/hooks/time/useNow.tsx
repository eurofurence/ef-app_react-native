import { useEffect, useState } from 'react'
import { addMilliseconds, getHours, getMinutes } from 'date-fns'
import { useTimeOffset } from '@/hooks/time/useTimeOffset'

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
const sameInResolution = (a: number, b: number, resolution: number) => Math.floor(a / resolution) === Math.floor(b / resolution)

/**
 * Get the current date, which includes time travelling.
 * @param resolution Static if not live. Otherwise, gives the minute hand
 * precision of the clock. Starts an interval, so use in central places only.
 */
export const useNow = (resolution: 'static' | number = 'static'): Date => {
    const { getTimeOffset } = useTimeOffset()
    const amount = getTimeOffset() || 0 // Assume it returns the ms offset

    const [now, setNow] = useState(() => nowWithOffset(amount))

    useEffect(() => {
        setNow(nowWithOffset(amount))
        if (resolution === 'static') return

        const handle = setInterval(() => {
            setNow((current) => {
                const next = nowWithOffset(amount)
                const currentMinutes = getHours(current) * 60 + getMinutes(current)
                const nextMinutes = getHours(next) * 60 + getMinutes(next)
                return sameInResolution(currentMinutes, nextMinutes, resolution) ? current : next
            })
        }, 500)

        return () => clearInterval(handle)
    }, [amount, resolution])

    return now
}
