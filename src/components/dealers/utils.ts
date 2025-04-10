import { isSameDay } from 'date-fns'

import { DealerDetails } from '@/context/data/types'

/**
 * True if for the given date the dealer is attending.
 * @param dealer The dealer to check.
 * @param now The date to check.
 */
export const isPresent = (dealer: DealerDetails, now: Date) => {
  // Use AttendanceDays from transformed data if available
  if (dealer.AttendanceDays?.length > 0) {
    return dealer.AttendanceDays.some((day) => isSameDay(new Date(day.Date), now))
  }

  // Fallback to AttendsOn* properties if AttendanceDays not available
  const dayOfWeek = now.getDay()
  if (dayOfWeek === 4) return Boolean(dealer.AttendsOnThursday)
  if (dayOfWeek === 5) return Boolean(dealer.AttendsOnFriday)
  if (dayOfWeek === 6) return Boolean(dealer.AttendsOnSaturday)
  return false
}

/**
 * Concatenates the days that the dealers is attending. Note that the data model
 * does not align with the actual days.
 *
 * @param dealer The dealer to create the string for.
 * @param day1 The day to use for "Thursday".
 * @param day2 The day to use for "Friday".
 * @param day3 The day to use for "Saturday".
 */
export const joinOffDays = (dealer: DealerDetails, day1: string, day2: string, day3: string) => {
  return [!dealer.AttendsOnThursday && day1, !dealer.AttendsOnFriday && day2, !dealer.AttendsOnSaturday && day3].filter(Boolean).join(', ')
}
