import {onLongPressEvent, onPressEvent} from "@/app/(areas)/schedule/day-1";
import {EventCard2} from "@/components/events/EventCard2";
import {EventSection} from "@/components/events/EventSection";
import {EfSectionList} from "@/components/generic/lists/EfLists";
import {type EfEventFull, eventsFullCollection} from "@/data/collections/content/EventsFull";
import {synchronize, useIsSynchronizing} from "@/data/hooks/useSynchronize";
import {collectBy} from "@/util/arrays";
import {vibrateAfter} from "@/util/vibrateAfter";
import {inArray, isUndefined, not, or, useLiveQuery} from "@tanstack/react-db";
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Avatar } from '@/components/profile/Avatar'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import {useAppSetting} from '@/data/collections/supplemental/AppSettings'
import {StyleSheet} from "react-native";

export default function Personal() {
  const {results} = useScheduleSearch()
  const { t } = useTranslation('Events')
  const isSynchronizing = useIsSynchronizing()

  const [showInternal] = useAppSetting('ShowInternalEvents')

  const {data: events} = useLiveQuery({
    id: 'area-schedule-personal',
    query: q => q.from({item: eventsFullCollection})
      .where(({item}) => isUndefined(item.Hidden))
      .where(({item}) => not(isUndefined(item.Favorite)))
      .where(({item}) => or(showInternal, not(item.IsInternal)))
      .where(({item}) => or(!results, inArray(item.Id, results)))
      .orderBy(({item}) => item.StartDateTimeUtc)
  }, [showInternal, results])

  const grouping = useMemo(() => {
    return collectBy(events, a => a.Day.Name)
  }, [events])

  const listHeaderComponent = <Row type='center' variant='center' gap={10}>
        <Avatar />
        <Label type='lead' variant='middle'>
          {t('schedule_title')}
        </Label>
      </Row>

  const listEmptyComponent = <Label type='para' className='mt-5 ml-5 mr-5' variant='middle'>
        {t('schedule_empty')}
      </Label>

  return <EfSectionList<string, EfEventFull>
    refreshing={isSynchronizing}
    onRefresh={() => vibrateAfter(synchronize())}
    scrollEnabled={true}
    contentContainerClassName="pb-32"
    ListHeaderComponent={listHeaderComponent}
    ListEmptyComponent={listEmptyComponent}
    data={grouping}
    renderSection={({item}) => {
      return <EventSection
        style={styles.item}
        title={item}
        icon="calendar-outline"/>
    }}
    renderItem={({item}) => {
      return <EventCard2
        containerStyle={styles.item}
        event={item}
        onPress={onPressEvent}
        onLongPress={onLongPressEvent}/>
    }}
    accessibilityLabel={t('events_list', {defaultValue: 'Events list'})}
  />
}


const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
