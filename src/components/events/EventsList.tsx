import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { StyleSheet, Vibration } from 'react-native'

import { router } from 'expo-router'
import { EventCard, EventDetailsInstance } from './EventCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'

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
  const { isSynchronizing, synchronizeUi } = useCache()

  const onPress = useCallback((event: EventDetails) => {
    router.navigate({
      pathname: '/events/[id]',
      params: { id: event.Id },
    })
  }, [])

  const onLongPress = useCallback(
    (event: EventDetails) => {
      Vibration.vibrate(50)
      select?.(event)
    },
    [select]
  )

  const renderItem = useCallback(
    ({ item }: { item: EventDetailsInstance }) => {
      return <EventCard containerStyle={styles.item} event={item} type={cardType} onPress={onPress} onLongPress={onLongPress} />
    },
    [cardType, onLongPress, onPress]
  )

  return (
    <FlashList
      refreshing={isSynchronizing}
      onRefresh={synchronizeUi}
      contentContainerStyle={padEnd ? styles.container : undefined}
      scrollEnabled={true}
      ListHeaderComponent={leader}
      ListFooterComponent={trailer}
      ListEmptyComponent={empty}
      data={events}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={110}
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
