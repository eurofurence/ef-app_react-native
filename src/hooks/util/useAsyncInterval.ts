import { useEffect } from 'react'

/**
 * Creates an interval that runs the given callback. If the timer triggers again and the callback is still running, no
 * new invocation is started.
 * @param fn The callback function.
 * @param interval The interval time.
 */
export function useAsyncInterval(fn: () => Promise<unknown>, interval: number) {
  useEffect(() => {
    let active = false

    active = false
    const handle = setInterval(() => {
      if (active) return
      active = true
      fn().finally(() => {
        active = false
      })
    }, interval)

    return () => {
      clearInterval(handle)
    }
  }, [fn, interval])
}
