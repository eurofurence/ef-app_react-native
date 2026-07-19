import {conTimeZone} from "@/configuration";
import {daysCollection} from "@/data/collections/content/Days";
import {parseDefaultISO} from "@/util/parseDefaultISO";
import {useLiveQuery} from "@tanstack/react-db";
import {type DateArg, isSameDay} from "date-fns";
import {toZonedTime} from "date-fns-tz";

export function useCurrentEfDay(now: DateArg<Date>) {
  const {data: day} = useLiveQuery({
    id: 'today',
    query: q => q.from({day: daysCollection})
      .fn.where(({day}) => isSameDay(now, toZonedTime(parseDefaultISO(day.Date), conTimeZone)))
      .findOne()
  })
  return day
}
