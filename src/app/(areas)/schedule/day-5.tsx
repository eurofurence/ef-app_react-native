import { DayView } from '@/app/(areas)/schedule/day-1'
import { useCache } from '@/context/data/Cache'

export default function Day1() {
  const { eventDays } = useCache()
  const day = eventDays.length < 5 ? null : eventDays[4]
  return day ? <DayView day={day} /> : null
}
