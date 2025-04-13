import { captureException } from '@sentry/react-native'
import { TFunction } from 'i18next'
import { useMemo } from 'react'
import { Share } from 'react-native'
import { format, setDay } from 'date-fns'
import { DealerDetailsInstance, dealerInstanceForAny } from '@/components/dealers/DealerCard'
import { dealerSectionForCategory, dealerSectionForLetter, dealerSectionForLocation, DealerSectionProps } from '@/components/dealers/DealerSection'
import { appBase, conAbbr } from '@/configuration'

import { DealerDetails } from '@/context/data/types.details'

/**
 * Compares category, checks if the categories are adult labeled.
 * @param left Left category.
 * @param right Right category.
 */
const compareCategory = (left: string, right: string) => {
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

/**
 * Returns a list of dealer instances according to conversion rules.
 * @param now The current date.
 * @param items The items to transform.
 */
export const useDealerInstances = (now: Date, items: readonly DealerDetails[]) => {
  return useMemo(() => {
    // Using date-fns to compute day names for Monday, Tuesday, and Wednesday.
    const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), 'EEEE')
    const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), 'EEEE')
    const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), 'EEEE')
    return items.map((item) => dealerInstanceForAny(item, now, day1, day2, day3))
  }, [now, items])
}

/**
 * Returns a list of dealer instances or section headers according to conversion rules.
 * @param now The current date.
 * @param items General results.
 */
export const useDealerGroups = (now: Date, items: readonly DealerDetails[]) => {
  return useMemo(() => {
    const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), 'EEEE')
    const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), 'EEEE')
    const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), 'EEEE')

    // Build a map of categories.
    const categoryMap: Record<string, DealerDetailsInstance[]> = {}
    const result: (DealerSectionProps | DealerDetailsInstance)[] = []

    // If results are provided (search mode), simply map items.
    for (const item of items) {
      const category = item.CategoryPrimary || 'No category'
      ;(categoryMap[category] ??= []).push(dealerInstanceForAny(item, now, day1, day2, day3))
    }

    // Create sections for each category in sorted order.
    for (const category of Object.keys(categoryMap).sort(compareCategory)) {
      result.push(dealerSectionForCategory(category))
      result.push(...categoryMap[category])
    }

    return result
  }, [now, items])
}

/**
 * Returns a list of dealer instances or section headers according to location.
 * @param t The translation function.
 * @param now The current date.
 * @param items General results.
 */
export const useDealerLocationGroups = (t: TFunction, now: Date, items: readonly DealerDetails[]) => {
  return useMemo(() => {
    const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), 'EEEE')
    const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), 'EEEE')
    const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), 'EEEE')

    let sectionedRegular = false
    let sectionedAd = false

    const result: (DealerSectionProps | DealerDetailsInstance)[] = []
    for (const item of items) {
      if (item.IsAfterDark === false) {
        if (!sectionedRegular) {
          result.push(dealerSectionForLocation(t, false))
          sectionedRegular = true
        }
        result.push(dealerInstanceForAny(item, now, day1, day2, day3))
      }
    }
    for (const item of items) {
      if (item.IsAfterDark === true) {
        if (!sectionedAd) {
          result.push(dealerSectionForLocation(t, true))
          sectionedAd = true
        }
        result.push(dealerInstanceForAny(item, now, day1, day2, day3))
      }
    }

    return result
  }, [t, now, items])
}

/**
 * Returns a list of dealer instances or section headers sorted alphabetically.
 * @param now The current date.
 * @param items General results.
 */
export const useDealerAlphabeticalGroups = (now: Date, items: readonly DealerDetails[]) => {
  return useMemo(() => {
    const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), 'EEEE')
    const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), 'EEEE')
    const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), 'EEEE')

    const sectionedLetters: Record<string, boolean> = {}
    const result: (DealerSectionProps | DealerDetailsInstance)[] = []
    for (const item of items) {
      const firstLetter = item.DisplayNameOrAttendeeNickname[0].toUpperCase()
      if (!(firstLetter in sectionedLetters)) {
        result.push(dealerSectionForLetter(firstLetter))
        sectionedLetters[firstLetter] = true
      }
      result.push(dealerInstanceForAny(item, now, day1, day2, day3))
    }
    return result
  }, [now, items])
}

export const shareDealer = (dealer: DealerDetails) =>
  Share.share(
    {
      title: dealer.DisplayNameOrAttendeeNickname,
      url: `${appBase}/Web/Dealers/${dealer.Id}`,
      message: `Check out ${dealer.DisplayNameOrAttendeeNickname} on ${conAbbr}!\n${appBase}/Web/Dealers/${dealer.Id}`,
    },
    {}
  ).catch(captureException)
