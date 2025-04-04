import { isAfter, parseISO } from 'date-fns'
import { StoreData } from '@/context/data/Cache'
import { cancelEventReminder, rescheduleEventReminder } from '@/util/eventReminders'
import { Notification } from '@/store/background/slice'

/**
 * Sync reminders takes updates to events that are currently scheduled
 * on the device and applies the new times to the device notifications.
 * Since state of the notifications is maintained in the store, it updates
 * the sync data.
 * @param data The data to apply on.
 */
export async function syncReminders(data: StoreData): Promise<StoreData> {
    const save = (notification: Notification) => {
        data = { ...data, notifications: [...(data.notifications ?? []), notification] }
    }
    const remove = (id: string) => {
        data = { ...data, notifications: data.notifications?.filter(item => item.recordId !== id) }
    }

    for (const reminder of data.notifications) {
        const reminderData = reminder
        // Find event corresponding to reminder.recordId.
        const event = (data.events.dict)[reminderData.recordId]
        if (event) {
            if (isAfter(parseISO(event.LastChangeDateTimeUtc), parseISO(reminderData.dateCreatedUtc))) {
                // Reschedule reminder; timeTravel default to 0 for now.

                rescheduleEventReminder(event, 0, save, remove)
                    .catch((error) => console.warn('Reschedule error:', error))
            }
        } else {
            // Cancel reminder if event no longer exists
            cancelEventReminder(reminderData.recordId, remove)
                .catch((error) => console.warn('Cancel reminder error:', error))
        }
    }

    return data
}
