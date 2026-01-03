import type { LostAndFoundRecord } from '@/context/data/types.api'

/**
 * Filters Lost & Found items by status
 */
export function filterByStatus(
  items: LostAndFoundRecord[],
  status: 'Unknown' | 'Lost' | 'Found' | 'Returned' | 'All'
): LostAndFoundRecord[] {
  if (status === 'All') {
    return items
  }
  return items.filter((item) => item.Status === status)
}

/**
 * Sorts Lost & Found items by creation date (newest first)
 */
export function sortByDate(items: LostAndFoundRecord[]): LostAndFoundRecord[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.LastChangeDateTimeUtc).getTime() -
      new Date(a.LastChangeDateTimeUtc).getTime()
  )
}

/**
 * Groups Lost & Found items by status
 */
export function groupByStatus(items: LostAndFoundRecord[]): {
  Unknown: LostAndFoundRecord[]
  Lost: LostAndFoundRecord[]
  Found: LostAndFoundRecord[]
  Returned: LostAndFoundRecord[]
} {
  return {
    Unknown: items.filter((item) => item.Status === 'Unknown'),
    Lost: items.filter((item) => item.Status === 'Lost'),
    Found: items.filter((item) => item.Status === 'Found'),
    Returned: items.filter((item) => item.Status === 'Returned'),
  }
}
