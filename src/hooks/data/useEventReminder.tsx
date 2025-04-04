import { useCallback } from 'react'
import { scheduleEventReminder, cancelEventReminder } from '@/util/eventReminders'
import { useCache } from '@/context/data/DataCache'
import { Notification } from '@/store/background/slice'
import { EventRecord } from '@/context/data/types'

/**
 * Uses event reminder creation, removal, and toggle callbacks, as well as the
 * current event reminder state.
 * @param event The event to check for.
 */
export const useEventReminder = (event: EventRecord) => {
    const { getValue, setValue } = useCache()

    // Retrieve timeTravel value from cache, default to 0
    const settings = getValue('settings')
    const offset = settings?.timeTravelEnabled ? (settings?.timeTravelOffset ?? 0) : 0

    // Retrieve the reminder from cache
    const reminder = Boolean(getValue('notifications')?.find(item => item.recordId === event.Id))

    const save = useCallback((notification: Notification) =>
        setValue('notifications', [
            ...(getValue('notifications')?.filter(item => item.recordId !== notification.recordId) ?? []),
            notification,
        ]), [getValue, setValue])

    const remove = useCallback((id: string) => {
        setValue('notifications',
            (getValue('notifications')?.filter(item => item.recordId !== id) ?? []),
        )
    }, [getValue, setValue])

    const createReminder = useCallback(() => scheduleEventReminder(event, offset, save), [event, offset, save])
    const removeReminder = useCallback(() => cancelEventReminder(event.Id, remove), [event.Id, remove])
    const toggleReminder = useCallback(() => {
        if (reminder)
            return cancelEventReminder(event, remove)
        else
            return scheduleEventReminder(event, offset, save)
    }, [reminder, event, remove, offset, save])

    return {
        isFavorite: reminder,
        createReminder,
        removeReminder,
        toggleReminder,
    }
}
