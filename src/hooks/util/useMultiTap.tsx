import { useCallback, useRef } from 'react'

/**
 * Uses a multi tap gate.
 * @param count The count that needs to be reached.
 * @param onFulfilled The action on fulfilment.
 * @returns Returns a callback that increments the tap count.
 */
export function useMultiTap(count: number, onFulfilled: () => void) {
  const taps = useRef(0)
  const tapsReset = useRef<ReturnType<typeof setTimeout> | 0>(0)

  return useCallback(() => {
    if (tapsReset.current !== 0) clearTimeout(tapsReset.current)

    taps.current++

    if (taps.current >= count) {
      taps.current = 0
      onFulfilled()
    } else {
      tapsReset.current = setTimeout(() => {
        taps.current = 0
        tapsReset.current = 0
      }, 500)
    }
  }, [count, onFulfilled])
}
