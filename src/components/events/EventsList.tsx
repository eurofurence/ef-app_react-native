import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { vibrateAfter } from '@/util/vibrateAfter'
import { router } from 'expo-router'
import { EventCard, EventDetailsInstance } from './EventCard'

/**
 * The properties to the component.
 */
export type EventsListProps = {
  leader?: ReactElement
  events: EventDetailsInstance[]
  select?: (event: EventDetails) => void
  empty?: ReactElement
  trailer?: ReactElement
  cardType?: 'duration' | 'time'
  padEnd?: boolean
}
const keyExtractor = (item: EventDetailsInstance) => item.details.Id

export const EventsList: FC<EventsListProps> = ({ leader, events, select, empty, trailer, cardType = 'duration', padEnd = true }) => {
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()

  const onPress = useCallback((event: EventDetails) => {
    router.navigate({
      pathname: '/events/[id]',
      params: { id: event.Id },
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: EventDetailsInstance }) => {
      return <EventCard containerStyle={styles.item} event={item} type={cardType} onPress={onPress} />
    },
    [cardType, onPress]
  )

  return (
    <FlashList
      refreshing={isSynchronizing}
      onRefresh={() => vibrateAfter(synchronize())}
      contentContainerStyle={padEnd ? styles.container : undefined}
      scrollEnabled={true}
      ListHeaderComponent={leader}
      ListFooterComponent={trailer}
      ListEmptyComponent={empty}
      data={events}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={110}
      estimatedListSize={Dimensions.get('window')}
      extraData={theme}
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
