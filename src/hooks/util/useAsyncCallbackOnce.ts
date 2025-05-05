import { useCallback, useRef } from 'react'

/**
 * Wraps a callback that is asynchronous. If an invocation is active, the result
 * of that invocation is returned, otherwise a new one is started and then
 * returned.
 * @param callback The callback function.
 */
export const useAsyncCallbackOnce = <T extends (...args: any[]) => Promise<any>>(callback: T): ((...args: Parameters<T>) => ReturnType<T>) => {
  const active = useRef<ReturnType<T> | null>()
  return useCallback(
    (...args: Parameters<T>) => {
      if (active.current) return active.current

      active.current = callback(...args) as ReturnType<T>
      active.current.finally(() => {
        active.current = null
      })
      return active.current
    },
    [callback]
  )
}
