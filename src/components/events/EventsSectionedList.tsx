import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet } from 'react-native'

import { useEventCardInteractions } from '@/components/events/Events.common'
import { SectionProps } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { vibrateAfter } from '@/util/vibrateAfter'

import { EventCard, EventDetailsInstance } from './EventCard'
import { EventSection, EventSectionProps } from './EventSection'

/**
 * The properties to the component.
 */
export type EventsSectionedListProps = {
  leader?: ReactElement
  eventsGroups: (EventSectionProps | EventDetailsInstance)[]
  select?: (event: EventDetails) => void
  empty?: ReactElement
  trailer?: ReactElement
  cardType?: 'duration' | 'time'
  sticky?: boolean
  padEnd?: boolean
}

function getItemType(item: SectionProps | EventDetailsInstance) {
  return 'details' in item ? 'row' : 'sectionHeader'
}

function keyExtractor(item: SectionProps | EventDetailsInstance) {
  return 'details' in item ? item.details.Id : item.title
}

export const EventsSectionedList: FC<EventsSectionedListProps> = ({ leader, eventsGroups, select, empty, trailer, cardType = 'duration', sticky = true, padEnd = true }) => {
  const { t } = useTranslation('Events')
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()
  const stickyIndices = useMemo(() => (sticky ? findIndices(eventsGroups, (item) => !('details' in item)) : undefined), [eventsGroups, sticky])

  const { onPress, onLongPress } = useEventCardInteractions()

  const renderItem = useCallback(
    ({ item }: { item: SectionProps | EventDetailsInstance }) => {
      if ('details' in item) {
        return <EventCard containerStyle={styles.item} event={item} type={cardType} onPress={onPress} onLongPress={onLongPress} />
      } else {
        return <EventSection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />
      }
    },
    [cardType, onLongPress, onPress]
  )

  return (
    <FlashList
      refreshing={isSynchronizing}
      onRefresh={() => vibrateAfter(synchronize())}
      contentContainerStyle={padEnd ? styles.container : undefined}
      scrollEnabled={true}
      stickyHeaderIndices={stickyIndices}
      ListHeaderComponent={leader}
      ListFooterComponent={trailer}
      ListEmptyComponent={empty}
      data={eventsGroups}
      getItemType={getItemType}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={110}
      estimatedListSize={Dimensions.get('window')}
      extraData={theme}
      accessibilityLabel={t('events_list', { defaultValue: 'Events list' })}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
  container: {
    paddingBottom: 100,
  },
})
