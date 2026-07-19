import { differenceInMilliseconds } from 'date-fns'
import { de } from 'date-fns/locale/de'
import { format, toZonedTime } from 'date-fns-tz'
import { LRUCache } from 'lru-cache'
import { conTimeZone } from '@/configuration'
import type { EfEvent } from '@/data/types/EfEvent'
import type { EfId } from '@/data/types/EfId'
import { parseDefaultISO } from '@/util/parseDefaultISO'

type EfEventTiming = {
  start: Date
  startLocal: Date
  end: Date
  endLocal: Date
  formattedStart: string
  formattedEnd: string
  formattedDay: string
  formattedStartLocal: string
  formattedEndLocal: string
  formattedDayLocal: string
  formattedRuntime: string
}
const results = new LRUCache<EfId, EfEventTiming>({ max: 512 })

export function getTiming(event: EfEvent) {
  let result = results.get(event.Id)
  if (result === undefined) {
    const start = toZonedTime(
      parseDefaultISO(event.StartDateTimeUtc),
      conTimeZone
    )
    const startLocal = parseDefaultISO(event.StartDateTimeUtc)
    const end = toZonedTime(parseDefaultISO(event.EndDateTimeUtc), conTimeZone)
    const endLocal = parseDefaultISO(event.EndDateTimeUtc)

    // Calculate progress
    const durationMs = differenceInMilliseconds(end, start)

    // Convert to con timezone
    const formattedStart = format(start, 'p', {
      timeZone: conTimeZone,
      locale: de,
    })

    // Local time format
    const formattedEnd = format(end, 'p', { timeZone: conTimeZone, locale: de }) // End time format
    const formattedDay = format(start, 'EEE', { timeZone: conTimeZone }) // Day abbreviation
    const formattedStartLocal = format(startLocal, 'p', { locale: de })
    const formattedEndLocal = format(endLocal, 'p', { locale: de })
    const formattedDayLocal = format(startLocal, 'EEE', {})

    // Calculate duration
    const durationHours = durationMs / (1000 * 60 * 60)
    const durationMinutes = durationMs / (1000 * 60)
    const formattedRuntime =
      durationHours >= 1
        ? `${Math.floor(durationHours)}h`
        : `${Math.floor(durationMinutes)}m`

    result = {
      start,
      startLocal,
      end,
      endLocal,
      formattedStart,
      formattedEnd,
      formattedDay,
      formattedStartLocal,
      formattedEndLocal,
      formattedDayLocal,
      formattedRuntime,
    }
    results.set(event.Id, result)
  }
  return result
}

export function getProgress(event: EfEvent, now: Date) {
  const durationMs = differenceInMilliseconds(
    event.EndDateTimeUtc,
    event.StartDateTimeUtc
  )
  return (
    differenceInMilliseconds(
      now,
      toZonedTime(parseDefaultISO(event.StartDateTimeUtc), conTimeZone)
    ) / durationMs
  )
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
