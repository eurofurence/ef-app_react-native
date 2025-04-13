import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { captureException } from '@sentry/react-native'
import { format, isBefore, subMilliseconds, subMinutes } from 'date-fns'
import { conId } from '@/configuration'
import { Notification } from '@/store/background/slice'
import { EventRecord, RecordId } from '@/context/data/types.api'

export async function scheduleEventReminder(event: EventRecord, timeTravel: number, save: (notification: Notification) => void) {
  // Get relevant UTC times.
  const dateCreatedUtc = new Date()
  const dateScheduleUtc = subMinutes(subMilliseconds(new Date(event.StartDateTimeUtc), timeTravel), 30)

  // If platform is on device, schedule actual notification.
  if ((Platform.OS === 'android' || Platform.OS === 'ios') && isBefore(dateCreatedUtc, dateScheduleUtc)) {
    await Notifications.scheduleNotificationAsync({
      identifier: event.Id,
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
        channelId: 'event_reminders',
      },
    })
  }

  // Save notification to cache.
  save({
    recordId: event.Id,
    type: 'EventReminder',
    dateCreatedUtc: format(dateCreatedUtc, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    dateScheduledUtc: format(dateScheduleUtc, "yyyy-MM-dd'T'HH:mm:ssXXX"),
  })
}

export async function cancelEventReminder(event: EventRecord | RecordId, remove: (id: string) => void) {
  // Get actual identifier, might be called without an instance.
  const identifier = typeof event === 'string' ? event : event.Id

  // If platform is on device, cancel actual notification.
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    await Notifications.cancelScheduledNotificationAsync(identifier).catch((error) => captureException(error, { level: 'warning' }))
  }

  // Remove notification from cache.
  remove(identifier)
}

export async function rescheduleEventReminder(event: EventRecord, timeTravel: number, save: (notification: Notification) => void, remove: (id: string) => void) {
  await cancelEventReminder(event, remove)
  await scheduleEventReminder(event, timeTravel, save)
}
