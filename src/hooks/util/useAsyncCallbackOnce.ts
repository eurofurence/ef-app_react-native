import { useCallback, useRef } from 'react'

/**
 * Wraps a callback that is asynchronous. If an invocation is active, the result
 * of that invocation is returned, otherwise a new one is started and then
 * returned.
 * @param fn The callback function.
 */
export function useAsyncCallbackOnce<T extends (...args: any[]) => Promise<any>>(fn: T): (...args: Parameters<T>) => ReturnType<T> {
  const active = useRef<ReturnType<T> | null>()
  return useCallback(
    (...args: Parameters<T>) => {
      if (active.current) return active.current

      active.current = fn(...args).finally(() => {
        active.current = null
      }) as ReturnType<T>
      return active.current
    },
    [fn]
  )
}
