import { captureException } from '@sentry/react-native'
import { Share } from 'react-native'
import { appBase, conAbbr } from '@/configuration'
import type { EfDealerFull } from '@/data/collections/content/DealersFull'

/**
 * Compares category, checks if the categories are adult labeled.
 * @param left Left category.
 * @param right Right category.
 * todo: use
 */
export const compareCategory = (left: string, right: string) => {
  const leftAdult = left.toLowerCase().includes('adult')
  const rightAdult = right.toLowerCase().includes('adult')
  if (!leftAdult) {
    if (!rightAdult) return left < right ? -1 : left > right ? 1 : 0
    else return -1
  } else {
    if (!rightAdult) return 1
    else return left < right ? -1 : left > right ? 1 : 0
  }
}

export const shareDealer = (dealer: Pick<EfDealerFull, 'DisplayName' | 'Id'>) =>
  Share.share(
    {
      title: dealer.DisplayName || 'Unknown Dealer',
      url: `${appBase}/Web/Dealers/${dealer.Id}`,
      message: `Check out ${dealer.DisplayName || 'Unknown Dealer'} on ${conAbbr}!\n${appBase}/Web/Dealers/${dealer.Id}`,
    },
    {}
  ).catch(captureException)
