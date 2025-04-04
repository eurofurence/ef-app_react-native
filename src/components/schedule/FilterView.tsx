import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import * as React from 'react'
import { useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useCache } from '@/context/data/Cache'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { ComboModal, ComboModalRef } from '@/components/generic/atoms/ComboModal'
import { EventDayDetails, EventDetails, EventRoomDetails, EventTrackDetails } from '@/context/data/types'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useEventOtherGroups } from '@/components/events/Events.common'
import { Label } from '@/components/generic/atoms/Label'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Row } from '@/components/generic/containers/Row'
import { Tab } from '@/components/generic/containers/Tab'

function selectEvent(event: EventDetails) {
    return router.setParams({ selected: event.Id })
}

export function FilterView() {
    const { query } = useLocalSearchParams<{ query?: string }>()
    const { t } = useTranslation('Events')
    const { events, eventDays, eventTracks, eventRooms, searchEvents } = useCache()

    const activeStyle = useThemeBackground('secondary')
    const inactiveStyle = useThemeBackground('inverted')

    const now = useNow(5)
    const zone = useZoneAbbr()

    const daysRef = useRef<ComboModalRef<EventDayDetails>>(null)
    const tracksRef = useRef<ComboModalRef<EventTrackDetails>>(null)
    const roomsRef = useRef<ComboModalRef<EventRoomDetails>>(null)


    const [filterDays, setFilterDays] = useState<readonly EventDayDetails[]>([])
    const [filterTracks, setFilterTracks] = useState<readonly EventTrackDetails[]>([])
    const [filterRooms, setFilterRooms] = useState<readonly EventRoomDetails[]>([])

    const search = useFuseResults(searchEvents, query ?? '')
    const filtered = useMemo(() => {
        const daysIds = filterDays.map(item => item.Id)
        const tracksIds = filterTracks.map(item => item.Id)
        const roomsIds = filterRooms.map(item => item.Id)
        return (search ?? events.values).filter(item => {
            if (item.ConferenceDayId && daysIds.length && !daysIds.includes(item.ConferenceDayId)) return false
            if (item.ConferenceTrackId && tracksIds.length && !tracksIds.includes(item.ConferenceTrackId)) return false
            if (item.ConferenceRoomId && roomsIds.length && !roomsIds.includes(item.ConferenceRoomId)) return false
            return true
        })
    }, [search, events, filterDays, filterTracks, filterRooms])

    const groups = useEventOtherGroups(t, now, zone, filtered)

    const leader = useMemo(() => <View>
        <Label type="lead" variant="middle">
            Find events
        </Label>
        <Row type="stretch" variant="spaced">
            <Tab style={[styles.rounded, filterDays.length ? activeStyle : inactiveStyle]}
                 inverted
                 icon="calendar-outline"
                 text={t('filter_by_day')}
                 onPress={() =>
                     daysRef.current?.pick(eventDays.values, filterDays)?.then(result => setFilterDays(result ?? []))} />
            <Tab style={[styles.rounded, styles.rowCenter, filterTracks.length ? activeStyle : inactiveStyle]}
                 inverted
                 icon="bus-stop"
                 text={t('filter_by_track')}
                 onPress={() =>
                     tracksRef.current?.pick(eventTracks.values, filterTracks)?.then(result => setFilterTracks(result ?? []))} />
            <Tab style={[styles.rounded, filterRooms.length ? activeStyle : inactiveStyle]}
                 inverted
                 icon="office-building"
                 text={t('filter_by_room')}
                 onPress={() =>
                     roomsRef.current?.pick(eventRooms.values, filterRooms)?.then(result => setFilterRooms(result ?? []))} />
        </Row>
    </View>, [activeStyle, eventDays, eventRooms, eventTracks, filterDays, filterRooms, filterTracks, inactiveStyle, t])

    return (
        <>
            <ComboModal<EventDayDetails>
                ref={daysRef}
                title="Pick one or more days"
                getKey={item => item.Id}
                getLabel={item => item.Name}>
                <Label type="para">
                    Select the days to filter on.
                </Label>
            </ComboModal>

            <ComboModal<EventTrackDetails>
                ref={tracksRef}
                title="Pick one or more tracks"
                getKey={item => item.Id}
                getLabel={item => item.Name}>
                <Label type="para">
                    Select the tracks to filter on.
                </Label>
            </ComboModal>

            <ComboModal<EventRoomDetails>
                ref={roomsRef}
                title="Pick one or more rooms"
                getKey={item => item.Id}
                getLabel={item => item.Name}>
                <Label type="para">
                    Select the rooms to filter on.
                </Label>
            </ComboModal>

            <EventsSectionedList
                eventsGroups={groups}
                select={selectEvent}
                cardType="time"
                leader={leader}
            />
        </>

    )
}

const styles = StyleSheet.create({
    rounded: {
        margin: 10,
        borderRadius: 10,
    },
    rowCenter: {
        marginHorizontal: 8,
    },
})
