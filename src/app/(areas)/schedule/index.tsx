import { isSameDay } from 'date-fns'
import { Redirect } from 'expo-router'
import { useNow } from '@/hooks/time/useNow'
import { scheduleRoutePrefix } from '@/app/(areas)/schedule/+not-found'
import { useCache } from '@/context/data/Cache'

export default function RedirectIndex() {
    const now = useNow('static')
    const { eventDays } = useCache()

    // Not actionable yet. Return null.
    if (!eventDays.values.length) return null

    // Find matching date or use first.
    const target = eventDays.values.find(item => isSameDay(now, item.Date)) ?? eventDays.values[0]
    return <Redirect href={scheduleRoutePrefix + target.Id} />
}
