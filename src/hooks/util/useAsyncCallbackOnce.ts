import { useCallback, useRef } from 'react'

/**
 * Wraps a callback that is asynchronous. If an invocation is active, the result
 * of that invocation is returned, otherwise a new one is started and then
 * returned.
 * @param callback The callback function.
 */
export const useAsyncCallbackOnce = <T>(callback: () => Promise<T>): (() => Promise<T>) => {
  const active = useRef<Promise<T> | null>()
  return useCallback(() => {
    if (active.current) return active.current

    active.current = callback()
    active.current.finally(() => {
      active.current = null
    })
    return active.current
  }, [callback])
}
