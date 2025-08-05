import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { DealerCard } from '../dealers/DealerCard'
import { EventCard } from '../events/EventCard'
import { Section } from '../generic/atoms/Section'
import { KbEntryCard } from '../kb/KbEntryCard'
import { useDealerCardInteractions, useDealerInstances } from '@/components/dealers/Dealers.common'
import { useEventCardInteractions, useEventInstances } from '@/components/events/Events.common'
import { GlobalSearchResult } from '@/context/data/types.own'
import { DealerDetails, EventDetails, KnowledgeEntryDetails } from '@/context/data/types.details'
import { useKbEntryCardInteractions } from '@/components/kb/KbEntry.common'

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

  const dealerInteraction = useDealerCardInteractions()
  const eventInteractions = useEventCardInteractions()
  const kbEntryInteractions = useKbEntryCardInteractions()

  if (!results) return null
  return (
    <>
      {dealers && dealers.length > 0 && (
        <>
          <Section icon="card-search" title={tMenu('dealers')} />
          {dealers.map((item) => (
            <DealerCard key={item.details.Id} style={styles.item} dealer={item} onPress={dealerInteraction.onPress} onLongPress={dealerInteraction.onLongPress} />
          ))}
        </>
      )}
      {events && events.length > 0 && (
        <>
          <Section icon="card-search" title={tMenu('events')} />
          {events.map((item) => (
            <EventCard key={item.details.Id} style={styles.item} event={item} type="time" onPress={eventInteractions.onPress} onLongPress={eventInteractions.onLongPress} />
          ))}
        </>
      )}
      {kbGroups && kbGroups.length > 0 && (
        <>
          <Section icon="card-search" title={tMenu('info')} />
          {kbGroups.map((item) => (
            <KbEntryCard style={styles.item} entry={item} key={item.Id} onPress={kbEntryInteractions.onPress} />
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
