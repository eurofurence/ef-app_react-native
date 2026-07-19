import { toZonedTime } from 'date-fns-tz'
import { LRUCache } from 'lru-cache'
import { conTimeZone } from '@/configuration'
import { parseDefaultISO } from '@/util/parseDefaultISO'

const results = new LRUCache<string, number>({ max: 10 })

export function isDayOfWeek(date: string, dayOfWeek: number) {
  let result = results.get(date)
  if (result === undefined) {
    result = toZonedTime(parseDefaultISO(date), conTimeZone).getDay()
    results.set(date, result)
  }
  return result === dayOfWeek
}
