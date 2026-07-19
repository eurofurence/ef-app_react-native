import {conTimeZone} from "@/configuration";
import {parseDefaultISO} from "@/util/parseDefaultISO";
import {getHours} from "date-fns";
import {toZonedTime} from "date-fns-tz";

export function deriveCategorizedTime(dateStr: string) {
  const date = toZonedTime(parseDefaultISO(dateStr), conTimeZone)
  const hours = getHours(date)
  if (6 <= hours && hours < 13) return 'morning'
  if (13 <= hours && hours < 17) return 'afternoon'
  if (17 <= hours && hours < 21) return 'evening'
  return 'night'
}
