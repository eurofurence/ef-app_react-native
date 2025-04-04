import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import * as React from 'react'
import { useMemo } from 'react'
import { useNow } from '@/hooks/time/useNow'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { useCache } from '@/context/data/Cache'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useEventOtherGroups } from '@/components/events/Events.common'
import { EventsSectionedList } from '@/components/events/EventsSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Avatar } from '@/components/profile/Avatar'
import { EventDetails } from '@/context/data/types'

function selectEvent(event: EventDetails) {
    return router.setParams({ selected: event.Id })
}

export function PersonalView() {
    const { query } = useLocalSearchParams<{ query?: string }>()
    const { t } = useTranslation('Events')
    const now = useNow(5)
    const zone = useZoneAbbr()

    const { eventsFavorite, searchEventsFavorite } = useCache()
    const search = useFuseResults(searchEventsFavorite, query ?? '')
    const groups = useEventOtherGroups(t, now, zone, search ?? eventsFavorite)

    const leader = useMemo(() => <Row type="center" variant="center" gap={10}>
        <Avatar />
        <Label type="lead" variant="middle">
            {t('schedule_title')}
        </Label>
    </Row>, [t])

    const empty = useMemo(() => <Label type="para" mt={20} ml={20} mr={20} variant="middle">
        {t('schedule_empty')}
    </Label>, [t])

    return (
        <EventsSectionedList
            eventsGroups={groups}
            select={selectEvent}
            cardType="time"
            leader={leader}
            empty={empty}
        />
    )
}
