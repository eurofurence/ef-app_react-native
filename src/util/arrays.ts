import equals from 'fast-deep-equal'

/**
 * Generic comparison.
 * @param a Left side of comparison.
 * @param b Right side of comparison.
 */
export function compare(a: any, b: any) {
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b)
  else return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Order items by key.
 * @param items Items.
 * @param by By key, one or more, descending in specificity.
 */
export function orderBy<T>(items: readonly T[], by: (item: T) => any): T[]
export function orderBy<T>(
  items: readonly T[],
  ...by: ((item: T) => any)[]
): T[]
export function orderBy<T>(
  items: readonly T[],
  by: ((item: T) => any) | ((item: T) => any)[]
): T[] {
  const comparison = Array.isArray(by)
    ? (a: T, b: T) => {
        for (const step of by) {
          const intermediate = compare(step(a), step(b))
          if (intermediate !== 0) return intermediate
        }
        return 0
      }
    : (a: T, b: T) => {
        return compare(by(a), by(b))
      }

  return [...items].sort(comparison)
}

/**
 * Group items in a sequence by a separating characteristic given by grouping
 * function, i.e., when the next item is not of the same group anymore, start a
 * new group.
 * @param items Items to group.
 * @param groupOf Separating characteristic.
 */
export function collectBy<T, TGroup>(
  items: readonly T[],
  groupOf: (item: T) => TGroup
) {
  const result: (TGroup | T)[] = []

  let lastGroup: TGroup | null = null
  for (const item of items) {
    const group = groupOf(item)
    if (!equals(lastGroup, group)) {
      result.push(group)
      lastGroup = group
    }
    result.push(item)
  }
  return result
}

export function intersects<T>(left: T[], right: T[]) {
  return left.some((item) => right.includes(item))
}
