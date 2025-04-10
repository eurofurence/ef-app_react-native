import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { DealerCard } from '../dealers/DealerCard'
import { EventCard } from '../events/EventCard'
import { Section } from '../generic/atoms/Section'
import { KbEntryCard } from '../kb/KbEntryCard'
import { useDealerInstances } from '@/components/dealers/Dealers.common'
import { useEventInstances } from '@/components/events/Events.common'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { DealerDetails, EventDetails, GlobalSearchResult, KnowledgeEntryDetails } from '@/context/data/types'

export type GlobalSearchProps = {
  now: Date
  results: GlobalSearchResult[] | null
}

export const GlobalSearch = ({ now, results }: GlobalSearchProps) => {
  const { t: tMenu } = useTranslation('Menu')

  // Zone abbreviation for events.
  const zone = useZoneAbbr()

  // Use all dealers and group generically.
  const dealers = useDealerInstances(now, results?.filter((r) => r.type === 'dealer') as DealerDetails[])
  const events = useEventInstances(now, zone, results?.filter((r) => r.type === 'event') as EventDetails[])
  const kbGroups = results?.filter((r) => r.type === 'knowledgeEntry') as KnowledgeEntryDetails[]

  if (!results) return null
  return (
    <>
      {dealers && dealers.length > 0 && (
        <>
          <Section icon="card-search" title={tMenu('dealers')} />
          {dealers.map((item) => (
            <DealerCard
              key={item.details.Id}
              containerStyle={styles.item}
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
              containerStyle={styles.item}
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
              containerStyle={styles.item}
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
    paddingHorizontal: 20,
  },
})
