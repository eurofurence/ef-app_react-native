/**
 * Finds all indices of the matching items.
 * @param items The items to search.
 * @param predicate The predicate to apply.
 */
export const findIndices = <T>(items: T[], predicate: (item: T) => boolean) =>
  items
    .map((item, index) => [item, index] as const)
    .filter(([item]) => predicate(item))
    .map(([, index]) => index)
