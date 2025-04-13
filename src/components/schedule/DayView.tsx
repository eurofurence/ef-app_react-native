import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import * as React from 'react'
import { useMemo } from 'react'
import { useNow } from '@/hooks/time/useNow'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { useCache } from '@/context/data/Cache'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useEventDayGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { EventDayDetails, EventDetails } from '@/context/data/types.details'

function selectEvent(event: EventDetails) {
  return router.setParams({ selected: event.Id })
}

export function DayView({ day }: { day: EventDayDetails }) {
  const { query } = useLocalSearchParams<{ query?: string }>()
  const { t } = useTranslation('Events')
  const now = useNow(5)
  const zone = useZoneAbbr()

  const { eventsByDay, searchEventsByDay } = useCache()
  const search = useFuseResults(searchEventsByDay[day.Id], query ?? '')
  const groups = useEventDayGroups(t, now, zone, search ?? eventsByDay[day.Id])

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
