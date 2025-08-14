import { differenceInMilliseconds } from 'date-fns'
import { de } from 'date-fns/locale/de'
import { format, toZonedTime } from 'date-fns-tz'

import { conTimeZone } from '@/configuration'
import { EventDetails } from '@/context/data/types.details'
import { parseDefaultISO } from '@/util/parseDefaultISO'

export function calculateEventTiming(details: EventDetails, now: Date | 'done') {
  // Calculate progress
  const durationMs = differenceInMilliseconds(details.End, details.Start)
  const progress = now !== 'done' ? differenceInMilliseconds(now, details.Start) / durationMs : 1.1

  // Convert to con timezone
  const start = format(details.Start, 'p', { timeZone: conTimeZone, locale: de }) // Local time format
  const end = format(details.End, 'p', { timeZone: conTimeZone, locale: de }) // End time format
  const day = format(details.Start, 'EEE', { timeZone: conTimeZone }) // Day abbreviation
  const startLocal = format(details.StartLocal, 'p', { locale: de })
  const endLocal = format(details.EndLocal, 'p', { locale: de })
  const dayLocal = format(details.StartLocal, 'EEE', {})

  // Calculate duration
  const durationHours = durationMs / (1000 * 60 * 60)
  const durationMinutes = durationMs / (1000 * 60)
  const runtime = durationHours >= 1 ? `${Math.floor(durationHours)}h` : `${Math.floor(durationMinutes)}m`

  return {
    progress,
    start,
    end,
    day,
    startLocal,
    endLocal,
    dayLocal,
    runtime,
  }
}

/**
 * Format a date string to show the full weekday name in the convention timezone
 * @param dateStr The date string to format
 * @returns The formatted weekday name
 */
export function formatWeekdayInConventionTimezone(dateStr: string): string {
  const date = parseDefaultISO(dateStr)
  const zonedDate = toZonedTime(date, conTimeZone)
  return format(zonedDate, 'EEEE', { timeZone: conTimeZone })
}
