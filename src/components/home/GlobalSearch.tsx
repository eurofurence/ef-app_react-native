import { inArray, isUndefined, not, or, useLiveQuery } from '@tanstack/react-db'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { onLongPressDealer, onPressDealer } from '@/app/(areas)/dealers/all'
import { onLongPressEvent, onPressEvent } from '@/app/(areas)/schedule/day-1'
import { onPressKbEntry } from '@/app/knowledge'
import { DealerCard2 } from '@/components/dealers/DealerCard2'
import { dealersFullCollection } from '@/data/collections/content/DealersFull'
import { eventsFullCollection } from '@/data/collections/content/EventsFull'
import { kbEntriesCollection } from '@/data/collections/content/KbEntries'
import { useAppSetting } from '@/data/collections/supplemental/AppSettings'
import type { EfId } from '@/data/types/EfId'

import { EventCard2 } from '../events/EventCard2'
import { Section } from '../generic/atoms/Section'
import { KbEntryCard } from '../kb/KbEntryCard'

export type GlobalSearchProps = {
  resultDealers: EfId[] | null
  resultEvents: EfId[] | null
  resultKbEntries: EfId[] | null
}

export const GlobalSearch = ({
  resultDealers,
  resultEvents,
  resultKbEntries,
}: GlobalSearchProps) => {
  const { t: tMenu } = useTranslation('Menu')
  const { t: tAccessibility } = useTranslation('Home', {
    keyPrefix: 'accessibility',
  })

  const [showInternal] = useAppSetting('ShowInternalEvents')

  const { data: dealers } = useLiveQuery(
    {
      id: 'global-search-dealers',
      query: (q) =>
        q
          .from({ item: dealersFullCollection })
          .where(({ item }) => inArray(item.Id, resultDealers ?? []))
          .orderBy(({ item }) => item.DisplayName),
    },
    [resultDealers]
  )

  const { data: events } = useLiveQuery(
    {
      id: 'global-search-events',
      query: (q) =>
        q
          .from({ item: eventsFullCollection })
          .where(({ item }) => isUndefined(item.Hidden))
          .where(({ item }) => or(showInternal, not(item.IsInternal)))
          .where(({ item }) => inArray(item.Id, resultEvents ?? []))
          .orderBy(({ item }) => item.StartDateTimeUtc),
    },
    [showInternal, resultEvents]
  )

  const { data: entries } = useLiveQuery(
    {
      id: 'global-search-kb-entries',
      query: (q) =>
        q
          .from({ item: kbEntriesCollection })
          .where(({ item }) => inArray(item.Id, resultKbEntries ?? []))
          .orderBy(({ item }) => item.Title),
    },
    [showInternal, resultKbEntries]
  )

  if (!resultDealers && !resultEvents && !resultKbEntries) return null

  return (
    <View
      accessibilityLabel={tAccessibility('search_results_container')}
      accessibilityHint={tAccessibility('search_results_container_hint')}
    >
      {dealers && dealers.length > 0 && (
        <View
          accessibilityLabel={tAccessibility('dealers_search_section', {
            count: dealers.length,
          })}
        >
          <Section icon='card-search' title={tMenu('dealers')} />
          {dealers.map((item) => (
            <DealerCard2
              key={item.Id}
              style={styles.item}
              dealer={item}
              onPress={onPressDealer}
              onLongPress={onLongPressDealer}
            />
          ))}
        </View>
      )}
      {events && events.length > 0 && (
        <View
          accessibilityLabel={tAccessibility('events_search_section', {
            count: events.length,
          })}
        >
          <Section icon='card-search' title={tMenu('events')} />
          {events.map((item) => (
            <EventCard2
              key={item.Id}
              style={styles.item}
              event={item}
              type='time'
              onPress={onPressEvent}
              onLongPress={onLongPressEvent}
            />
          ))}
        </View>
      )}
      {entries && entries.length > 0 && (
        <View
          accessibilityLabel={tAccessibility('knowledge_search_section', {
            count: entries.length,
          })}
        >
          <Section icon='card-search' title={tMenu('info')} />
          {entries.map((item) => (
            <KbEntryCard
              style={styles.item}
              entry={item}
              key={item.Id}
              onPress={onPressKbEntry}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 20,
  },
})
