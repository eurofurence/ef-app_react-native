import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useEventOtherGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { Badge } from '@/components/generic/containers/Badge'
import { Row } from '@/components/generic/containers/Row'
import { Avatar } from '@/components/profile/Avatar'
import { useCache } from '@/context/data/Cache'
import { useScheduleSearch } from '@/context/ScheduleSearchContext'
import { useAppSetting } from '@/data/collections/AppSettings'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'

export default function Personal() {
  const { query } = useScheduleSearch()
  const { t } = useTranslation('Events')
  const now = useNow()

  const { eventsFavorite, searchEventsFavorite } = useCache()
  const search = useFuseResults(searchEventsFavorite, query ?? '')
  const [showInternal] = useAppSetting('ShowInternalEvents')
  const filtered = useMemo(
    () =>
      (search ?? eventsFavorite).filter((e) => showInternal || !e.IsInternal),
    [search, eventsFavorite, showInternal]
  )
  const groups = useEventOtherGroups(t, now, filtered, search == null)

  const leader = useMemo(
    () => (
      <>
        {search !== null ? (
          <Badge
            unpad={0}
            badgeColor='lighten'
            textColor='text'
            textType='regular'
          >
            {t('section_notice_search')}
          </Badge>
        ) : (
          ''
        )}
        <Row
          type='center'
          variant='center'
          gap={10}
          className={search !== null ? 'mt-3' : ''}
        >
          <Avatar />
          <Label type='lead' variant='middle'>
            {t('schedule_title')}
          </Label>
        </Row>
      </>
    ),
    [t, search]
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
