import { toZonedTime } from 'date-fns-tz'
import { conTimeZone } from '@/configuration'
import { parseDefaultISO } from '@/util/parseDefaultISO'

export function isDayOfWeek(date: string, dayOfWeek: number) {
  return toZonedTime(parseDefaultISO(date), conTimeZone).getDay()
}
