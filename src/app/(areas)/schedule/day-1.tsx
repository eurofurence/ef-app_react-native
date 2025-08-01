import { useEventDayGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/Cache'
import { EventDayDetails, EventDetails } from '@/context/data/types.details'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'
import { router } from 'expo-router'
import * as React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

function selectEvent(event: EventDetails) {
  return router.setParams({ selected: event.Id })
}

export function DayView({ day }: { day: EventDayDetails }) {
  const { query } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const now = useNow(5)

  const { eventsByDay, searchEventsByDay } = useCache()
  const search = useFuseResults(searchEventsByDay[day.Id], query ?? '')
  const groups = useEventDayGroups(t, now, search ?? eventsByDay[day.Id])

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
  const day = eventDays.length < 1 ? null : eventDays[0]
  return day ? <DayView day={day} /> : null
}
