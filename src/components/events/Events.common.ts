import { captureException } from '@sentry/react-native'
import { differenceInHours, isBefore } from 'date-fns'
import { router } from 'expo-router'
import type { TFunction } from 'i18next'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Share } from 'react-native'

import {
  type EventDetailsInstance,
  eventInstanceForAny,
  eventInstanceForNotPassed,
  eventInstanceForPassed,
} from '@/components/events/EventCard'
import {
  type EventSectionProps,
  eventSectionForDate,
  eventSectionForHidden,
  eventSectionForPartOfDay,
  eventSectionForPassed,
} from '@/components/events/EventSection'
import { appBase, conAbbr } from '@/configuration'
import type { EventDetails } from '@/context/data/types.details'
import { useToastContext } from '@/context/ui/ToastContext'
import { useEventReminder } from '@/hooks/data/useEventReminder'

/**
 Returns a list of event instances according to conversion rules.
 * @param now The current moment.
 * @param items The items to transform.
 */
export const useEventInstances = (
  now: Date,
  items: readonly EventDetails[]
) => {
  // Return direct mapping.
  return useMemo(() => {
    return items.map((item) => eventInstanceForAny(item, now))
  }, [items, now])
}

/**
 * Generates event grouping with event detail instances prepared for
 * display dates with the context of the current day.
 * @param t The translation function.
 * @param now The current moment.
 * @param items The events on that day.
 */
export const useEventDayGroups = (
  t: TFunction,
  now: Date,
  items: readonly EventDetails[]
) => {
  return useMemo(() => {
    let hidden = 0

    // Sections are consecutive as event start time (which informs the
    // part of day) is the sort key. Section changes are therefore
    // consecutive as well. Passed events are collected in the second pass.
    let sectionedMorning = false
    let sectionedAfternoon = false
    let sectionedEvening = false
    let sectionedNight = false
    let sectionedPassed = false
    let sectionedLongRunning = false

    const result: (EventSectionProps | EventDetailsInstance)[] = []

    // Count hidden and append all by start time.
    for (const item of items) {
      if (item.Hidden) {
        hidden++
      } else if (isBefore(now, item.End)) {
        // First pass not passed.
        if (differenceInHours(item.End, item.Start) > 4) {
          if (!sectionedLongRunning) {
            result.push(eventSectionForPartOfDay(t, 'long_running'))
            sectionedLongRunning = true
          }

          result.push(eventInstanceForNotPassed(item, now))
        } else if (item.PartOfDay === 'morning') {
          if (!sectionedMorning) {
            result.push(eventSectionForPartOfDay(t, 'morning'))
            sectionedMorning = true
          }

          result.push(eventInstanceForNotPassed(item, now))
        } else if (item.PartOfDay === 'afternoon') {
          if (!sectionedAfternoon) {
            result.push(eventSectionForPartOfDay(t, 'afternoon'))
            sectionedAfternoon = true
          }

          result.push(eventInstanceForNotPassed(item, now))
        } else if (item.PartOfDay === 'evening') {
          if (!sectionedEvening) {
            result.push(eventSectionForPartOfDay(t, 'evening'))
            sectionedEvening = true
          }

          result.push(eventInstanceForNotPassed(item, now))
        } else if (item.PartOfDay === 'night') {
          if (!sectionedNight) {
            result.push(eventSectionForPartOfDay(t, 'night'))
            sectionedNight = true
          }

          result.push(eventInstanceForNotPassed(item, now))
        }
      }
    }

    // Add hidden header.
    if (hidden > 0) {
      result.splice(0, 0, eventSectionForHidden(t, hidden))
    }

    // Second pass not hidden and passed.
    for (const item of items) {
      if (!item.Hidden && !isBefore(now, item.End)) {
        if (!sectionedPassed) {
          result.push(eventSectionForPassed(t))
          sectionedPassed = true
        }
        result.push(eventInstanceForPassed(item))
      }
    }

    return result
  }, [t, now, items])
}

/**
 Generates event grouping with event detail instances prepared for
 display standalone dates.
 * @param t The translation function.
 * @param now The current moment.
 * @param items The events.
 */
export const useEventOtherGroups = (
  t: TFunction,
  now: Date,
  items: readonly EventDetails[]
) => {
  return useMemo(() => {
    let hidden = 0

    // Days sections changes are consecutive, as the default sorting
    // for events is by time. Passed events are collected in the second
    // pass.
    const sectionedDays: Record<string, boolean> = {}
    let sectionedPassed = false
    const result: (EventSectionProps | EventDetailsInstance)[] = []

    // Count hidden and append all by start time.
    for (const item of items) {
      if (item.Hidden) {
        hidden++
      } else if (!item.ConferenceDay) {
        // Nothing, not applicable.
      } else if (isBefore(now, item.End)) {
        if (!(item.ConferenceDay.Date in sectionedDays)) {
          result.push(eventSectionForDate(item.ConferenceDay.Date))
          sectionedDays[item.ConferenceDay.Date] = true
        }

        result.push(eventInstanceForNotPassed(item, now))
      }
    }

    // Add hidden header.
    if (hidden > 0) {
      result.splice(0, 0, eventSectionForHidden(t, hidden))
    }

    // Second pass not hidden and passed.
    for (const item of items) {
      if (!item.Hidden && !isBefore(now, item.End)) {
        if (!sectionedPassed) {
          result.push(eventSectionForPassed(t))
          sectionedPassed = true
        }
        result.push(eventInstanceForPassed(item))
      }
    }

    return result
  }, [t, now, items])
}

export const shareEvent = (event: EventDetails) =>
  Share.share(
    {
      title: event.Title,
      url: `${appBase}/Web/Events/${event.Id}`,
      message: `Check out ${event.Title} on ${conAbbr}!\n${appBase}/Web/Events/${event.Id}`,
    },
    {}
  ).catch(captureException)

/**
 * Uses default handlers for event card interaction, i.e., opening the event or toggling favorites.
 */
export function useEventCardInteractions(notify = true) {
  const { toggleReminder } = useEventReminder()
  const { toast } = useToastContext()
  const { t } = useTranslation('Events')

  const onPress = useCallback((event: EventDetails) => {
    router.navigate({
      pathname: '/events/[id]',
      params: { id: event.Id },
    })
  }, [])

  const onLongPress = useCallback(
    async (event: EventDetails) => {
      const mode = await toggleReminder(event)
      if (!notify) return
      if (mode === 'added') toast('info', t('favorite_added'), 3000)
      else if (mode === 'removed') toast('info', t('favorite_removed'), 3000)
    },
    [toggleReminder, notify, toast, t]
  )

  return {
    onPress,
    onLongPress,
  }
}
