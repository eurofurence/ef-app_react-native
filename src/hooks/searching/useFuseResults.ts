import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'

/**
 * Uses a stable Fuse instance and provides a list for results for searching
 * it with the given filter, or `null` if the filter is empty.
 * @param fuse The Fuse instance.
 * @param filter The text to search.
 * @param limit The item limit.
 */
export const useFuseResults = <T extends object>(fuse: Fuse<T>, filter: string, limit = 100): T[] | null => {
  const [filterDebounce, setFilterDebounce] = useState(filter)

  useEffect(() => {
    // Always reset immediately.
    if (!filter) {
      setFilterDebounce('')
      return
    }

    // Debounce entry.
    const timeoutId = setTimeout(() => setFilterDebounce(filter), 60)
    return () => clearTimeout(timeoutId)
  }, [filter])

  return useMemo(() => {
    if (!filterDebounce.length) return null
    else return fuse.search(filterDebounce, { limit }).map((result) => result.item)
  }, [fuse, filterDebounce, limit])
}
