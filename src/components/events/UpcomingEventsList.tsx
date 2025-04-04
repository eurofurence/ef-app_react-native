import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { router } from 'expo-router'
import { isWithinInterval, subMinutes } from 'date-fns'
import { Section } from '../generic/atoms/Section'
import { EventCard, eventInstanceForAny } from './EventCard'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { useCache } from '@/context/data/DataCache'
import { EventDetails } from '@/context/data/types'

const filterUpcomingEvents = (events: EventDetails[], now: Date) =>
    events.filter((it) => {
        const startDate = new Date(it.StartDateTimeUtc)
        const startMinus30 = subMinutes(startDate, 30)
        return isWithinInterval(now, { start: startMinus30, end: startDate })
    })

export type UpcomingEventsListProps = {
    now: Date;
};
export const UpcomingEventsList: FC<UpcomingEventsListProps> = ({ now }) => {
    const { t } = useTranslation('Events')
    const { getEntityValues } = useCache()

    const zone = useZoneAbbr()
    const all = getEntityValues('events')

    const events = useMemo(
        () =>
            filterUpcomingEvents(all, now)
                .filter((item) => !item.Hidden)
                .map((details) => eventInstanceForAny(details, now, zone)),
        [all, now, zone],
    )

    if (events.length === 0) {
        return null
    }

    return (
        <>
            <Section title={t('upcoming_title')} subtitle={t('upcoming_subtitle')} icon="clock" />
            <View style={styles.condense}>
                {events.map((event) => (
                    <EventCard
                        key={event.details.Id}
                        event={event}
                        type="time"
                        onPress={(event) =>
                            router.navigate({
                                pathname: '/events/[eventId]',
                                params: { eventId: event.Id },
                            })
                        }
                    />
                ))}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    condense: {
        marginVertical: -15,
    },
})
