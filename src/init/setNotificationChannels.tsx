import * as Notifications from 'expo-notifications'
import { setNotificationChannelAsync } from 'expo-notifications'

import { captureNotificationException } from '@/sentryHelpers'

// Import globally at index, this code runs the method on import.

// Setup default channel.
setNotificationChannelAsync('default', {
  name: 'Miscellaneous',
  importance: Notifications.AndroidImportance.MIN,
  lightColor: '#006459',
}).catch((e) => captureNotificationException('Failed to assign Miscellaneous notification channel:', e))

setNotificationChannelAsync('event_reminders', {
  name: 'Event Reminders',
  importance: Notifications.AndroidImportance.HIGH,
  lightColor: '#006459',
}).catch((e) => captureNotificationException('Failed to assign Event Reminders notification channel:', e))

setNotificationChannelAsync('announcements', {
  name: 'Announcements',
  importance: Notifications.AndroidImportance.DEFAULT,
  lightColor: '#006459',
}).catch((e) => captureNotificationException('Failed to assign Announcements notification channel:', e))

setNotificationChannelAsync('private_messages', {
  name: 'Private Messages',
  importance: Notifications.AndroidImportance.DEFAULT,
  lightColor: '#006459',
}).catch((e) => captureNotificationException('Failed to assign Private Messages notification channel:', e))
