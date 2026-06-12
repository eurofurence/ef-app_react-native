import { useCallback, useState } from 'react'

import { appSettingsCollection, appSettingsDefaults } from '@/data/collections/AppSettings'
import { subMilliseconds, subSeconds } from 'date-fns'
import { addMilliseconds } from 'date-fns/addMilliseconds'
import { useFocusEffect } from 'expo-router'

/**
 * Offset provided by the app settings.
 */
let currentOffset = 0

/**
 * Subscribe to retrieving the app settings for time travel.
 */
appSettingsCollection.subscribeChanges(() => {
  const source = appSettingsCollection.get('singleton') ?? appSettingsDefaults
  currentOffset = source.TimeTravelEnabled ? source.TimeTravelOffset : 0
})

function floorToSeconds(now: Date) {
  return subMilliseconds(now, now.getMilliseconds())
}

function floorToMinutes(now: Date) {
  return subSeconds(subMilliseconds(now, now.getMilliseconds()), now.getSeconds())
}


/**
 * All registered listeners for precise time hooks.
 */
const secondsListeners = new Set<() => void>()

/**
 * Result emitted to precise time hooks.
 */
let secondsResult = floorToSeconds(new Date())

/**
 * All registered listeners for wide time hooks.
 */
const minutesListeners = new Set<() => void>()

/**
 * Result emitted to wide time hooks.
 */
let minutesResult = floorToMinutes(new Date())

/**
 * Connect updating the time.
 */
setInterval(() => {
  // Get current time and add the time travel offset.
  const now = currentOffset ? addMilliseconds(new Date(), currentOffset) : new Date()

  /**
   * If the "second-hand" changed, emit a new time, where the milliseconds are removed.
   */
  if (secondsResult.getSeconds() !== now.getSeconds()) {
    secondsResult = subMilliseconds(now, now.getMilliseconds())
    for (const listener of secondsListeners) {
      listener()
    }
  }

  /**
   * If the "minute-hand" changed, emit a new time, where the milliseconds and seconds are removed.
   */
  if (minutesResult.getMinutes() !== now.getMinutes()) {
    minutesResult = subSeconds(subMilliseconds(now, now.getMilliseconds()), now.getSeconds())
    for (const listener of minutesListeners) {
      listener()
    }
  }
}, 500)

/**
 * Stable function for external store sub.
 */
export function subscribeSeconds(listener: () => void) {
  secondsListeners.add(listener)
  return () => secondsListeners.delete(listener)
}

/**
 * Stable function for external store sub.
 */
export function subscribeMinutes(listener: () => void) {
  minutesListeners.add(listener)
  return () => minutesListeners.delete(listener)
}

/**
 * Uses a low-precision per minute time object that only updates when
 * the "minute-hand" changed.
 * @param _input Deprecated.
 */
export function useNow(_input?: number | 'static') {
  const [now, setNow] = useState(minutesResult)

  useFocusEffect(useCallback(() => {
    setNow(minutesResult)
    return subscribeMinutes(() => setNow(minutesResult))
  }, []))

  return now
}

/**
 * Uses a high-precision time object that only updates when the "second-hand"
 * changed.
 */
export function useNowPrecise() {
  const [now, setNow] = useState(secondsResult)

  useFocusEffect(useCallback(() => {
    setNow(secondsResult)
    return subscribeSeconds(() => setNow(secondsResult))
  }, []))

  return now
}

/**
 * Gets the current time with offset applied, no time components are removed.
 */
export function getNow() {
  return new Date(Date.now() + currentOffset)
}

// todo verify
// if (import.meta.hot)
//   import.meta.hot.dispose(() => clearInterval(handle))


//
// /**
//  * Returns the current time with a millisecond offset.
//  * @param amount The ms offset.
//  */
// const nowWithOffset = (amount: number) => addMilliseconds(new Date(), amount)
//
// /**
//  * True if the values are equal in a given quantization.
//  * @param a The first value.
//  * @param b The second value.
//  * @param resolution The resolution.
//  */
// const sameInResolution = (a: number, b: number, resolution: number) =>
//   Math.floor(a / resolution) === Math.floor(b / resolution)
//
// /**
//  * Get the current date, which includes time traveling.
//  * @param resolution Static if not live. Otherwise, gives the minute hand
//  * precision of the clock. Starts an interval, so use in central places only.
//  */
// export const useNow = (resolution: 'static' | number = 'static'): Date => {
//   const [enabled] = useAppSetting('TimeTravelEnabled')
//   const [offset] = useAppSetting('TimeTravelOffset')
//   const effectiveOffset = enabled ? offset : 0
//
//   const [now, setNow] = useState(() => nowWithOffset(effectiveOffset))
//
//   useEffect(() => {
//     setNow(nowWithOffset(effectiveOffset))
//     if (resolution === 'static') return
//
//     const handle = setInterval(() => {
//       setNow((current) => {
//         const next = nowWithOffset(effectiveOffset)
//         const currentMinutes = getHours(current) * 60 + getMinutes(current)
//         const nextMinutes = getHours(next) * 60 + getMinutes(next)
//         return sameInResolution(currentMinutes, nextMinutes, resolution)
//           ? current
//           : next
//       })
//     }, 500)
//
//     return () => clearInterval(handle)
//   }, [effectiveOffset, resolution])
//
//   return now
// }
//
// /**
//  * Returns a function that gets the current date with optional time travel offset.
//  */
// export function useGetNow(): () => Date {
//   const [enabled] = useAppSetting('TimeTravelEnabled')
//   const [offset] = useAppSetting('TimeTravelOffset')
//   const effectiveOffset = enabled ? offset : 0
//
//   return useCallback(() => addMilliseconds(new Date(), effectiveOffset), [effectiveOffset])
// }
