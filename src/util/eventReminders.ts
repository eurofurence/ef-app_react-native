import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { captureException } from '@sentry/react-native'
import { isBefore, subMilliseconds, subMinutes } from 'date-fns'
import { conId } from '@/configuration'
import { Notification } from '@/store/background/slice'
import { EventRecord } from '@/context/data/types.api'
import { parseDefaultISO } from '@/util/parseDefaultISO'
import { SchedulableTriggerInputTypes } from 'expo-notifications'

export async function scheduleEventReminder(event: EventRecord, timeTravel: number): Promise<Notification> {
  // Get relevant UTC times.
  const dateCreatedUtc = new Date()
  const dateScheduleUtc = subMinutes(subMilliseconds(parseDefaultISO(event.StartDateTimeUtc), timeTravel), 30)

  // If platform is on device, schedule actual notification.
  if ((Platform.OS === 'android' || Platform.OS === 'ios') && isBefore(dateCreatedUtc, dateScheduleUtc)) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: event.Title,
        subtitle: 'This event is starting soon!',
        data: {
          CID: conId,
          Event: 'Event',
          RelatedId: event.Id,
        },
      },
      trigger: {
        date: dateScheduleUtc,
        type: SchedulableTriggerInputTypes.DATE,
        channelId: 'event_reminders',
      },
    })

    // Save notification to cache.
    return {
      recordId: event.Id,
      identifier: identifier,
      type: 'EventReminder',
      dateCreatedUtc: dateCreatedUtc.toISOString(),
      dateScheduledUtc: dateScheduleUtc.toISOString(),
    }
  } else {
    // Save notification to cache.
    return {
      recordId: event.Id,
      type: 'EventReminder',
      dateCreatedUtc: dateCreatedUtc.toISOString(),
      dateScheduledUtc: dateScheduleUtc.toISOString(),
    }
  }
}

export async function cancelEventReminder(notification: Notification) {
  // If platform is on device, cancel actual notification.
  if ((Platform.OS === 'android' || Platform.OS === 'ios') && typeof notification.identifier === 'string') {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier).catch((error) => captureException(error, { level: 'warning' }))
  }
}
