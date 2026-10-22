import type { EfDealerFull } from '@/data/collections/content/DealersFull'

export function deriveDealerTable(
  dealer: Pick<EfDealerFull, 'ShortDescription'>
) {
  if (!dealer.ShortDescription) return undefined
  if (!dealer.ShortDescription?.startsWith('Table')) return undefined

  return dealer.ShortDescription.split(/\r?\n/, 1)[0]
    .substring('Table'.length)
    .trim()
}
