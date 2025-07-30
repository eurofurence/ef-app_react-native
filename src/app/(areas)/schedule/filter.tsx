import { useEventOtherGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { ComboModal, ComboModalRef } from '@/components/generic/atoms/ComboModal'
import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Tab } from '@/components/generic/containers/Tab'
import { useCache } from '@/context/data/Cache'
import { EventDayDetails, EventDetails, EventRoomDetails, EventTrackDetails } from '@/context/data/types.details'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { router } from 'expo-router'
import * as React from 'react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

function selectEvent(event: EventDetails) {
  return router.setParams({ selected: event.Id })
}

export default function FilterScreen() {
  const { query } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const { events, eventDays, eventTracks, eventRooms, eventHosts, searchEvents } = useCache()

  const activeStyle = useThemeBackground('secondary')
  const inactiveStyle = useThemeBackground('inverted')

  const now = useNow()

  const daysRef = useRef<ComboModalRef<EventDayDetails>>(null)
  const tracksRef = useRef<ComboModalRef<EventTrackDetails>>(null)
  const roomsRef = useRef<ComboModalRef<EventRoomDetails>>(null)
  const hostsRef = useRef<ComboModalRef<string>>(null)

  const [filterDays, setFilterDays] = useState<readonly EventDayDetails[]>([])
  const [filterTracks, setFilterTracks] = useState<readonly EventTrackDetails[]>([])
  const [filterRooms, setFilterRooms] = useState<readonly EventRoomDetails[]>([])
  const [filterHosts, setFilterHosts] = useState<readonly string[]>([])

  const search = useFuseResults(searchEvents, query ?? '')
  const filtered = useMemo(() => {
    const daysIds = filterDays.map((item) => item.Id)
    const tracksIds = filterTracks.map((item) => item.Id)
    const roomsIds = filterRooms.map((item) => item.Id)
    const hostNames = filterHosts
    return (search ?? events).filter((item) => {
      if (item.ConferenceDayId && daysIds.length && !daysIds.includes(item.ConferenceDayId)) return false
      if (item.ConferenceTrackId && tracksIds.length && !tracksIds.includes(item.ConferenceTrackId)) return false
      if (item.ConferenceRoomId && roomsIds.length && !roomsIds.includes(item.ConferenceRoomId)) return false
      if (item.Hosts && hostNames.length && !hostNames.some((name) => item.Hosts.includes(name))) return false
      return true
    })
  }, [filterDays, filterTracks, filterRooms, filterHosts, search, events])

  const groups = useEventOtherGroups(t, now, filtered)

  const leader = (
    <View>
      <Label type="lead" variant="middle">
        Find events
      </Label>
      <Row style={styles.filters} type="stretch" variant="spaced" gap={10}>
        <Tab
          style={[styles.rounded, filterDays.length ? activeStyle : inactiveStyle]}
          inverted
          icon="calendar-outline"
          text={t('filter_by_day')}
          onPress={() => daysRef.current?.pick(eventDays, filterDays)?.then((result) => setFilterDays(result ?? []))}
        />
        <Tab
          style={[styles.rounded, filterTracks.length ? activeStyle : inactiveStyle]}
          inverted
          icon="bus-stop"
          text={t('filter_by_track')}
          onPress={() => tracksRef.current?.pick(eventTracks, filterTracks)?.then((result) => setFilterTracks(result ?? []))}
        />
        <Tab
          style={[styles.rounded, filterRooms.length ? activeStyle : inactiveStyle]}
          inverted
          icon="office-building"
          text={t('filter_by_room')}
          onPress={() => roomsRef.current?.pick(eventRooms, filterRooms)?.then((result) => setFilterRooms(result ?? []))}
        />
        <Tab
          style={[styles.rounded, filterHosts.length ? activeStyle : inactiveStyle]}
          inverted
          icon="human-male-board"
          text={t('filter_by_host')}
          onPress={() => hostsRef.current?.pick(eventHosts, filterHosts)?.then((result) => setFilterHosts(result ?? []))}
        />
      </Row>
    </View>
  )

  return (
    <>
      <ComboModal<EventDayDetails> ref={daysRef} title="Pick one or more days" getKey={(item) => item.Id} getLabel={(item) => item.Name}>
        <Label type="para">Select the days to filter on.</Label>
      </ComboModal>

      <ComboModal<EventTrackDetails> ref={tracksRef} title="Pick one or more tracks" getKey={(item) => item.Id} getLabel={(item) => item.Name}>
        <Label type="para">Select the tracks to filter on.</Label>
      </ComboModal>

      <ComboModal<EventRoomDetails> ref={roomsRef} title="Pick one or more rooms" getKey={(item) => item.Id} getLabel={(item) => item.Name}>
        <Label type="para">Select the rooms to filter on.</Label>
      </ComboModal>

      <ComboModal<string> ref={hostsRef} title="Pick one or more hosts" getKey={(item) => item} getLabel={(item) => item}>
        <Label type="para">Select the hosts to filter on.</Label>
      </ComboModal>

      <EventsSectionedList eventsGroups={groups} select={selectEvent} cardType="time" leader={leader} />
    </>
  )
}

const styles = StyleSheet.create({
  filters: {
    margin: 20,
  },
  rounded: {
    borderRadius: 10,
  },
})
