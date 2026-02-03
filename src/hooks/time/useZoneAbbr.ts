import { useCalendars } from 'expo-localization'
import { useMemo } from 'react'

import { conTimeZone } from '@/configuration'

/**
 * Uses the currently selected calendar's zone abbreviation without using moment.
 */
export const useZoneAbbr = () => {
  const calendars = useCalendars()
  const timeZone = calendars[0]?.timeZone ?? conTimeZone
  return useMemo(() => {
    // Use Intl.DateTimeFormat with timeZoneName 'short' to get an abbreviated time zone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    })
    const parts = formatter.formatToParts(new Date())
    const zoneAbbr = parts.find((part) => part.type === 'timeZoneName')?.value
    return zoneAbbr || ''
  }, [timeZone])
}
