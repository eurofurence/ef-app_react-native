import { captureException } from '@sentry/react-native'
import { isBefore, subMilliseconds, subMinutes } from 'date-fns'
import { randomUUID } from 'expo-crypto'
import * as Notifications from 'expo-notifications'
import { SchedulableTriggerInputTypes } from 'expo-notifications'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { conId } from '@/configuration'
import {
  type EfEventFull,
  eventsFullCollection,
} from '@/data/collections/content/EventsFull'
import { appSettingsCollection } from '@/data/collections/supplemental/AppSettings'
import { localNotificationsCollection } from '@/data/collections/supplemental/LocalNotifications'
import type { EfLocalNotification } from '@/data/types/EfLocalNotification'
import { getNowOffset } from '@/hooks/time/useNow'
import { parseDefaultISO } from '@/util/parseDefaultISO'

async function scheduleEventReminder(
  time: string,
  id: string,
  title: string,
  subtitle: string,
  timeTravel: number
): Promise<EfLocalNotification> {
  // Get relevant UTC times.
  const dateCreatedUtc = new Date()
  const dateScheduleUtc = subMinutes(
    subMilliseconds(parseDefaultISO(time), timeTravel),
    30
  )

  // If platform is on device, schedule actual notification.
  if (
    (Platform.OS === 'android' || Platform.OS === 'ios') &&
    isBefore(dateCreatedUtc, dateScheduleUtc)
  ) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        subtitle: subtitle,
        data: {
          CID: conId,
          Event: 'Event',
          RelatedId: id,
        },
      },
      trigger: {
        date: dateScheduleUtc,
        type: SchedulableTriggerInputTypes.DATE,
        channelId: 'event_reminders',
      },
    })

    // Return entity for the store.
    return {
      Id: identifier,
      TargetId: id,
      CreatedUtc: dateCreatedUtc.toISOString(),
      ScheduledUtc: dateScheduleUtc.toISOString(),
    }
  } else {
    // Return entity for the store.
    return {
      Id: `offline:${randomUUID()}`,
      TargetId: id,
      CreatedUtc: dateCreatedUtc.toISOString(),
      ScheduledUtc: dateScheduleUtc.toISOString(),
    }
  }
}

async function cancelEventReminder(id: string) {
  // If platform is on device, cancel actual notification.
  if (
    (Platform.OS === 'android' || Platform.OS === 'ios') &&
    !id.startsWith('offline:')
  ) {
    await Notifications.cancelScheduledNotificationAsync(id).catch((error) =>
      captureException(error, { level: 'warning' })
    )
  }
}

/**
 * Process event was added to favorites.
 * @param event Event that was added.
 * @param offset Timetravel offset.
 */
async function processAdded(event: EfEventFull, offset: number) {
  // Sanitize potential duplicate.
  const notification = localNotificationsCollection.get(event.Id)
  if (notification) {
    await cancelEventReminder(notification.Id)
    localNotificationsCollection.delete(event.Id)
  }

  // Schedule for entity.
  const entity = await scheduleEventReminder(
    event.StartDateTimeUtc,
    event.Id,
    event.Title,
    'This event is starting soon!',
    offset
  )

  // Insert new.
  localNotificationsCollection.insert(entity)
}

/**
 * Process favorite event was changed.
 * @param event The event that was changed.
 * @param offset Timetravel offset.
 */
async function processChange(event: EfEventFull, offset: number) {
  // Remove and unschedule old notification.
  const notification = localNotificationsCollection.get(event.Id)
  if (notification) {
    await cancelEventReminder(notification.Id)
    localNotificationsCollection.delete(event.Id)
  }

  // Schedule and add new.
  const entity = await scheduleEventReminder(
    event.StartDateTimeUtc,
    event.Id,
    event.Title,
    'This event is starting soon!',
    offset
  )

  // Insert.
  localNotificationsCollection.insert(entity)
}

/**
 * Process unfavorite event or deletion of source event.
 * @param event Event that was unfavorited or deleted.
 */
async function processRemoved(event: EfEventFull) {
  // Remove and unschedule old notification.
  const notification = localNotificationsCollection.get(event.Id)
  if (notification) {
    await cancelEventReminder(notification.Id)
    localNotificationsCollection.delete(event.Id)
  }
}

/**
 * Uses connection of favorites on collections to local notifications.
 */
export function useLocalNotificationsIntegration() {
  useEffect(() => {
    // Subscribe to event changes.
    const subEvents = eventsFullCollection.subscribeChanges(async (changes) => {
      for (const change of changes) {
        // Get current TTO.
        const offset = getNowOffset()

        // Process types of changes.
        if (!change.previousValue?.Favorite && change.value.Favorite) {
          await processAdded(change.value, offset)
        } else if (change.previousValue?.Favorite && change.value.Favorite) {
          await processChange(change.value, offset)
        } else if (change.previousValue?.Favorite && !change.value.Favorite) {
          await processRemoved(change.value)
        } else if (change.type === 'delete') {
          await processRemoved(change.value)
        }
      }
    })

    // Subscribe to TTO changes.
    const subSettings = appSettingsCollection.subscribeChanges((changes) => {
      for (const change of changes) {
        // Iterates all changes, but there will only ever be one key. Check if the TTO changed.
        const previousOffset = change.previousValue?.TimeTravelEnabled
          ? change.previousValue?.TimeTravelOffset
          : 0
        const currentOffset = change.value.TimeTravelEnabled
          ? change.value.TimeTravelOffset
          : 0
        if (previousOffset === currentOffset) continue

        // Changed, reschedule.
        localNotificationsCollection.forEach(async (notification) => {
          // Get the corresponding event. Must exist but don't jinx it.
          const event = eventsFullCollection.get(notification.TargetId)
          if (!event) return

          // Remove and add.
          await processRemoved(event)
          await processAdded(event, currentOffset)
        })
      }
    })

    // Return unsubs.
    return () => {
      subEvents.unsubscribe()
      subSettings.unsubscribe()
    }
  }, [])
}
