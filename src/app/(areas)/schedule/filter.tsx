import { inArray, isUndefined, not, or, useLiveQuery } from '@tanstack/react-db'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { onLongPressEvent, onPressEvent } from '@/app/(areas)/schedule/day-1'
import { EventCard2 } from '@/components/events/EventCard2'
import { EventSection } from '@/components/events/EventSection'
import {
  ComboModal,
  type ComboModalRef,
} from '@/components/generic/atoms/ComboModal'
import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Tab } from '@/components/generic/containers/Tab'
import { EfSectionList } from '@/components/generic/lists/EfLists'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { daysCollection } from '@/data/collections/content/Days'
import {
  type EfEventFull,
  eventsFullCollection,
} from '@/data/collections/content/EventsFull'
import { roomsCollection } from '@/data/collections/content/Rooms'
import { tracksCollection } from '@/data/collections/content/Tracks'
import { useAppSetting } from '@/data/collections/supplemental/AppSettings'
import { synchronize, useIsSynchronizing } from '@/data/hooks/useSynchronize'
import type { EfDay } from '@/data/types/EfDay'
import type { EfRoom } from '@/data/types/EfRoom'
import type { EfTrack } from '@/data/types/EfTrack'
import { deriveHosts } from '@/data/utils/deriveHosts'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { collectBy, intersects } from '@/util/arrays'
import { vibrateAfter } from '@/util/vibrateAfter'

export default function FilterScreen() {
  const { results } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const isSynchronizing = useIsSynchronizing()

  const [showInternal] = useAppSetting('ShowInternalEvents')

  const { data: events } = useLiveQuery(
    {
      id: 'area-schedule-filter',
      query: (q) =>
        q
          .from({ item: eventsFullCollection })
          .where(({ item }) => isUndefined(item.Hidden))
          .where(({ item }) => or(showInternal, not(item.IsInternal)))
          .where(({ item }) => or(!results, inArray(item.Id, results)))
          .orderBy(({ item }) => item.StartDateTimeUtc),
    },
    [showInternal, results]
  )

  const { data: days } = useLiveQuery(daysCollection)
  const { data: tracks } = useLiveQuery(tracksCollection)
  const { data: rooms } = useLiveQuery(roomsCollection)

  const { data: eventsForHosts } = useLiveQuery(eventsFullCollection)
  const hosts = useMemo(() => {
    const result = new Set<string>()
    for (const event of events)
      for (const host of deriveHosts(event.PanelHosts)) result.add(host)

    return [...result].sort()
  }, [eventsForHosts])

  const activeStyle = useThemeBackground('secondary')
  const inactiveStyle = useThemeBackground('inverted')

  const daysRef = useRef<ComboModalRef<EfDay>>(null)
  const tracksRef = useRef<ComboModalRef<EfTrack>>(null)
  const roomsRef = useRef<ComboModalRef<EfRoom>>(null)
  const hostsRef = useRef<ComboModalRef<string>>(null)

  const [filterDays, setFilterDays] = useState<EfDay[]>([])
  const [filterTracks, setFilterTracks] = useState<EfTrack[]>([])
  const [filterRooms, setFilterRooms] = useState<EfRoom[]>([])
  const [filterHosts, setFilterHosts] = useState<string[]>([])

  const grouping = useMemo(() => {
    const daysIds = filterDays.map((item) => item.Id)
    const tracksIds = filterTracks.map((item) => item.Id)
    const roomsIds = filterRooms.map((item) => item.Id)
    const hostNames = filterHosts

    const matched = events.filter((item) => {
      if (
        item.ConferenceDayId &&
        daysIds.length &&
        !daysIds.includes(item.ConferenceDayId)
      )
        return false
      if (
        item.ConferenceTrackId &&
        tracksIds.length &&
        !tracksIds.includes(item.ConferenceTrackId)
      )
        return false
      if (
        item.ConferenceRoomId &&
        roomsIds.length &&
        !roomsIds.includes(item.ConferenceRoomId)
      )
        return false
      if (
        item.PanelHosts &&
        hostNames.length &&
        !intersects(deriveHosts(item.PanelHosts), hostNames)
      )
        return false
      return true
    })
    return collectBy(matched, (a) => a.Day.Name)
  }, [events, filterDays, filterTracks, filterRooms, filterHosts])

  const listHeaderComponent = (
    <View>
      <Label type='lead' variant='middle'>
        Find events
      </Label>
      <Row style={styles.filters} type='stretch' variant='spaced' gap={10}>
        <Tab
          style={[
            styles.rounded,
            filterDays.length ? activeStyle : inactiveStyle,
          ]}
          inverted
          icon='calendar-outline'
          text={t('filter_by_day')}
          onPress={() =>
            daysRef.current?.pick(days, filterDays, (result) =>
              setFilterDays(result ?? [])
            )
          }
        />
        <Tab
          style={[
            styles.rounded,
            filterTracks.length ? activeStyle : inactiveStyle,
          ]}
          inverted
          icon='bus-stop'
          text={t('filter_by_track')}
          onPress={() =>
            tracksRef.current?.pick(tracks, filterTracks, (result) =>
              setFilterTracks(result ?? [])
            )
          }
        />
        <Tab
          style={[
            styles.rounded,
            filterRooms.length ? activeStyle : inactiveStyle,
          ]}
          inverted
          icon='office-building'
          text={t('filter_by_room')}
          onPress={() =>
            roomsRef.current?.pick(rooms, filterRooms, (result) =>
              setFilterRooms(result ?? [])
            )
          }
        />
        <Tab
          style={[
            styles.rounded,
            filterHosts.length ? activeStyle : inactiveStyle,
          ]}
          inverted
          icon='human-male-board'
          text={t('filter_by_host')}
          onPress={() =>
            hostsRef.current?.pick(hosts, filterHosts, (result) =>
              setFilterHosts(result ?? [])
            )
          }
        />
      </Row>
    </View>
  )

  return (
    <>
      <ComboModal<EfDay>
        ref={daysRef}
        title='Pick one or more days'
        getKey={(item) => item.Id}
        getLabel={(item) => item.Name}
      >
        <Label type='para'>Select the days to filter on.</Label>
      </ComboModal>

      <ComboModal<EfTrack>
        ref={tracksRef}
        title='Pick one or more tracks'
        getKey={(item) => item.Id}
        getLabel={(item) => item.Name}
      >
        <Label type='para'>Select the tracks to filter on.</Label>
      </ComboModal>

      <ComboModal<EfRoom>
        ref={roomsRef}
        title='Pick one or more rooms'
        getKey={(item) => item.Id}
        getLabel={(item) => item.Name}
      >
        <Label type='para'>Select the rooms to filter on.</Label>
      </ComboModal>

      <ComboModal<string>
        ref={hostsRef}
        title='Pick one or more hosts'
        getKey={(item) => item}
        getLabel={(item) => item}
      >
        <Label type='para'>Select the hosts to filter on.</Label>
      </ComboModal>

      <EfSectionList<string, EfEventFull>
        refreshing={isSynchronizing}
        onRefresh={() => vibrateAfter(synchronize())}
        scrollEnabled={true}
        contentContainerClassName='pb-32'
        ListHeaderComponent={listHeaderComponent}
        data={grouping}
        renderSection={({ item }) => {
          return (
            <EventSection
              style={styles.item}
              title={item}
              icon='calendar-outline'
            />
          )
        }}
        renderItem={({ item }) => {
          return (
            <EventCard2
              containerStyle={styles.item}
              event={item}
              onPress={onPressEvent}
              onLongPress={onLongPressEvent}
            />
          )
        }}
        accessibilityLabel={t('events_list', { defaultValue: 'Events list' })}
      />
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
  item: {
    paddingHorizontal: 20,
  },
})
