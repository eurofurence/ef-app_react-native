import { DayView } from '@/app/(areas)/schedule/day-1'
import { useCache } from '@/context/data/Cache'

export default function Day2() {
  const { eventDays } = useCache()
  const day = eventDays.length < 2 ? null : eventDays[1]
  return day ? <DayView day={day} /> : null
}
