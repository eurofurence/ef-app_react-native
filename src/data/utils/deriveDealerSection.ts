import type {EfDealerFull} from "@/data/collections/content/DealersFull";
import {deriveDealerTable} from "@/data/utils/deriveDealerTable";

export function deriveDealerSection(dealer: Pick<EfDealerFull, 'ShortDescription'>) {
  return deriveDealerTable(dealer)?.split('/')[0]
}
