import { DayView } from '@/app/(areas)/schedule/day-1'
import { useCache } from '@/context/data/Cache'

export default function Day1() {
  const { eventDays } = useCache()
  const day = eventDays.length < 7 ? null : eventDays[6]
  return day ? <DayView day={day} /> : null
}
