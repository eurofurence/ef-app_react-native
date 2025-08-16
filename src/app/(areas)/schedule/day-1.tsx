import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useEventDayGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/Cache'
import { EventDayDetails, EventDetails } from '@/context/data/types.details'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'

function selectEvent(event: EventDetails) {
  return router.setParams({ selected: event.Id })
}

export function DayView({ day }: { day: EventDayDetails }) {
  const { query } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const now = useNow(5)

  const { eventsByDay, searchEventsByDay, getValue } = useCache()
  const search = useFuseResults(searchEventsByDay[day.Id], query ?? '')
  const showInternal = getValue('settings').showInternalEvents ?? true
  const filtered = (search ?? eventsByDay[day.Id]).filter((e) => showInternal || !e.IsInternal)
  const groups = useEventDayGroups(t, now, filtered)

  const leader = useMemo(
    () => (
      <View>
        <Label type="lead" variant="middle">
          {day?.Name ?? ''}
        </Label>
      </View>
    ),
    [day]
  )

  return <EventsSectionedList eventsGroups={groups} select={selectEvent} leader={leader} />
}

export default function Day1() {
  const { eventDays } = useCache()
  const params = useLocalSearchParams<{ day?: string }>()

  // Use navigation state to determine which day to show
  // This prevents race conditions during fast swiping
  const dayIndex = params.day ? parseInt(params.day) - 1 : 0
  const day = eventDays.length > dayIndex ? eventDays[dayIndex] : null

  return day ? <DayView day={day} /> : null
}
