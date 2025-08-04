import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { DealerCard } from '../dealers/DealerCard'
import { EventCard } from '../events/EventCard'
import { Section } from '../generic/atoms/Section'
import { KbEntryCard } from '../kb/KbEntryCard'
import { useDealerInstances } from '@/components/dealers/Dealers.common'
import { useEventInstances } from '@/components/events/Events.common'
import { GlobalSearchResult } from '@/context/data/types.own'
import { DealerDetails, EventDetails, KnowledgeEntryDetails } from '@/context/data/types.details'

export type GlobalSearchProps = {
  now: Date
  results: GlobalSearchResult[] | null
}

export const GlobalSearch = ({ now, results }: GlobalSearchProps) => {
  const { t: tMenu } = useTranslation('Menu')

  // Filter for type tags.
  const dealerFiltered = useMemo(() => results?.filter((r) => r.type === 'dealer') as DealerDetails[], [results])
  const eventsFiltered = useMemo(() => results?.filter((r) => r.type === 'event') as EventDetails[], [results])
  const kbGroupsFiltered = useMemo(() => results?.filter((r) => r.type === 'knowledgeEntry') as KnowledgeEntryDetails[], [results])

  // Use all dealers and group generically.
  const dealers = useDealerInstances(now, dealerFiltered)
  const events = useEventInstances(now, eventsFiltered)
  const kbGroups = kbGroupsFiltered

  if (!results) return null
  return (
    <>
      {dealers && dealers.length > 0 && (
        <>
          <Section icon="card-search" title={tMenu('dealers')} />
          {dealers.map((item) => (
            <DealerCard
              key={item.details.Id}
              style={styles.item}
              dealer={item}
              onPress={(dealer) =>
                router.navigate({
                  pathname: '/dealers/[id]',
                  params: { id: dealer.Id },
                })
              }
            />
          ))}
        </>
      )}
      {events && events.length > 0 && (
        <>
          <Section icon="card-search" title={tMenu('events')} />
          {events.map((item) => (
            <EventCard
              key={item.details.Id}
              style={styles.item}
              event={item}
              type="time"
              onPress={(event) =>
                router.navigate({
                  pathname: '/events/[id]',
                  params: { eventId: event.Id },
                })
              }
            />
          ))}
        </>
      )}
      {kbGroups && kbGroups.length > 0 && (
        <>
          <Section icon="card-search" title={tMenu('info')} />
          {kbGroups.map((item) => (
            <KbEntryCard
              style={styles.item}
              entry={item}
              key={item.Id}
              onPress={(entry) =>
                router.navigate({
                  pathname: '/knowledge/[id]',
                  params: { id: entry.Id },
                })
              }
            />
          ))}
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 20,
  },
})
