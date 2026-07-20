import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useEventDayGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/Cache'
import type { EventDayDetails } from '@/context/data/types.details'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { useAppSetting } from '@/data/collections/AppSettings'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'

export function DayView({ day }: { day: EventDayDetails }) {
  const { query } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const now = useNow()

  const { eventsByDay, searchEventsByDay } = useCache()
  const search = useFuseResults(searchEventsByDay[day.Id], query ?? '')
  const [showInternal] = useAppSetting('ShowInternalEvents')
  const filtered = useMemo(
    () =>
      (search ?? eventsByDay[day.Id]).filter(
        (e) => showInternal || !e.IsInternal
      ),
    [search, eventsByDay, day.Id, showInternal]
  )
  const groups = useEventDayGroups(t, now, filtered)

  const leader = useMemo(
    () => (
      <View>
        <Label type='lead' variant='middle'>
          {day?.Name ?? ''}
        </Label>
        <Label type='lead' variant='middle'>
          {day?.Date.split('T')[0] ?? ''}
        </Label>
      </View>
    ),
    [day]
  )

  return <EventsSectionedList eventsGroups={groups} leader={leader} />
}

export default function Day1() {
  const { eventDays } = useCache()
  const day = eventDays.length < 1 ? null : eventDays[0]
  return day ? <DayView day={day} /> : null
}
