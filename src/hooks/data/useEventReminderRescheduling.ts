import { captureException } from '@sentry/react-native'
import { isAfter } from 'date-fns'
import { useEffect, useRef } from 'react'

import { useCache } from '@/context/data/Cache'
import type { Notification } from '@/store/background/slice'
import {
  cancelEventReminder,
  scheduleEventReminder,
} from '@/util/eventReminders'
import { parseDefaultISO } from '@/util/parseDefaultISO'

/**
 * Synchronizes currently scheduled device notifications with incoming event
 * data. E.g., events may have been deleted or the time changed. The
 * notifications should be updated accordingly.
 */
export function useEventReminderRescheduling() {
  const { events, getValue, setValue } = useCache()

  // Retrieve timeTravel value from cache, default to 0
  const settings = getValue('settings')
  const offset = settings?.timeTravelEnabled
    ? (settings.timeTravelOffset ?? 0)
    : 0

  const notifications = getValue('notifications')

  const lastPromise = useRef(Promise.resolve())

  useEffect(() => {
    let preempted = false

    lastPromise.current = (async () => {
      await lastPromise.current.catch(() => {})

      if (preempted) return

      const newNotifications: Notification[] = []
      let changed = false

      for (const notification of notifications) {
        const event = events.dict[notification.recordId]

        if (event) {
          // Check if event changed since notification was created
          if (
            isAfter(
              parseDefaultISO(event.LastChangeDateTimeUtc),
              parseDefaultISO(notification.dateCreatedUtc)
            )
          ) {
            try {
              await cancelEventReminder(notification)
              const newNotification = await scheduleEventReminder(event, offset)
              newNotifications.push(newNotification)
              changed = true
            } catch (error) {
              captureException(error)
            }
          } else {
            // Unchanged event, keep existing notification
            newNotifications.push(notification)
          }
        } else {
          // Event no longer exists; cancel notification and remove it
          try {
            await cancelEventReminder(notification)
            changed = true
          } catch (error) {
            captureException(error)
          }
        }
      }

      if (changed) {
        setValue('notifications', newNotifications)
      }
    })()

    return () => {
      preempted = true
    }
  }, [events, notifications, offset, setValue])
}
