import { useCache } from '@/context/data/Cache'
import { DayView } from '@/app/(areas)/schedule/day-1'

export default function Day1() {
  const { eventDays } = useCache()
  const day = eventDays.length < 6 ? null : eventDays[5]
  return day ? <DayView day={day} /> : null
}
