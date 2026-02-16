import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useEventOtherGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Avatar } from '@/components/profile/Avatar'
import { useCache } from '@/context/data/Cache'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'

export default function Personal() {
  const { query } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const now = useNow()

  const { eventsFavorite, searchEventsFavorite, getValue } = useCache()
  const search = useFuseResults(searchEventsFavorite, query ?? '')
  const showInternal = getValue('settings').showInternalEvents ?? true
  const filtered = (search ?? eventsFavorite).filter(
    (e) => showInternal || !e.IsInternal
  )
  const groups = useEventOtherGroups(t, now, filtered)

  const leader = useMemo(
    () => (
      <Row type='center' variant='center' gap={10}>
        <Avatar />
        <Label type='lead' variant='middle'>
          {t('schedule_title')}
        </Label>
      </Row>
    ),
    [t]
  )

  const empty = useMemo(
    () => (
      <Label type='para' className='mt-5 ml-5 mr-5' variant='middle'>
        {t('schedule_empty')}
      </Label>
    ),
    [t]
  )

  return (
    <EventsSectionedList
      eventsGroups={groups}
      cardType='duration'
      leader={leader}
      empty={empty}
    />
  )
}
