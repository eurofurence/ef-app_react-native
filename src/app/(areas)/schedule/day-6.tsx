import { useLocalSearchParams } from 'expo-router'

import { DayView } from '@/app/(areas)/schedule/day-1'
import { useCache } from '@/context/data/Cache'

export default function Day6() {
  const { eventDays } = useCache()
  const params = useLocalSearchParams<{ day?: string }>()

  // Use navigation state to determine which day to show
  // This prevents race conditions during fast swiping
  const dayIndex = params.day ? parseInt(params.day) - 1 : 5
  const day = eventDays.length > dayIndex ? eventDays[dayIndex] : null

  return day ? <DayView day={day} /> : null
}
