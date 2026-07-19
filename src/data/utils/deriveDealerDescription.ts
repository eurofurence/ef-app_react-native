import type {EfDealerFull} from "@/data/collections/content/DealersFull";

export function deriveDealerDescription(dealer: Pick<EfDealerFull, 'ShortDescription'>) {
  if (!dealer.ShortDescription) return dealer.ShortDescription
  if (!dealer.ShortDescription?.startsWith('Table'))
    return dealer.ShortDescription

  return dealer.ShortDescription.split(/\r?\n/).slice(1).join('\n').trimStart()
}
