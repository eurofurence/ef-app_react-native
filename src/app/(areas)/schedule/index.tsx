import { isSameDay } from 'date-fns'
import { Redirect } from 'expo-router'
import { useNow } from '@/hooks/time/useNow'
import { scheduleRoutePrefix } from '@/app/(areas)/schedule/+not-found'
import { useCache } from '@/context/data/DataCache'

export default function RedirectIndex() {
    const now = useNow('static')
    const { getEntityValues } = useCache()
    const days = getEntityValues('eventDays')

    // Not actionable yet. Return null.
    if (!days.length) return null

    // Find matching date or use first.
    const target = days.find(item => isSameDay(now, item.Date)) ?? days[0]
    return <Redirect href={scheduleRoutePrefix + target.Id} />
}
