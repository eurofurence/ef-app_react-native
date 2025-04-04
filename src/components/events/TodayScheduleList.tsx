import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { isBefore, isSameDay } from 'date-fns'
import { EventCard, eventInstanceForAny } from './EventCard'
import { Section } from '@/components/generic/atoms/Section'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { useCache } from '@/context/data/DataCache'
import { EventDetails } from '@/context/data/types'

const filterHappeningTodayEvents = <T extends Pick<EventDetails, 'StartDateTimeUtc' | 'EndDateTimeUtc'>>(events: T[], now: Date): T[] =>
    events.filter((it) => isSameDay(now, new Date(it.StartDateTimeUtc))).filter((it) => isBefore(now, new Date(it.EndDateTimeUtc)))

export type TodayScheduleListProps = {
    now: Date;
};

export const TodayScheduleList: FC<TodayScheduleListProps> = ({ now }) => {
    const { t } = useTranslation('Events')
    const { getEntityValues } = useCache()
    const zone = useZoneAbbr()

    const events = useMemo(() => {
        const allEvents = getEntityValues('events')
        const favorites = allEvents.filter(item => item.Favorite && !item.Hidden)

        return filterHappeningTodayEvents(favorites, now)
            .map((details) => eventInstanceForAny(details, now, zone))
    }, [getEntityValues, now, zone])

    if (events.length === 0) {
        return null
    }

    return (
        <>
            <Section title={t('today_schedule_title')} subtitle={t('today_schedule_subtitle')} icon="book-marker" />
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
