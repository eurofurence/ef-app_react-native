import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { DealerCard, DealerDetailsInstance } from './DealerCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'
import { DealerDetails } from '@/context/data/types.details'

/**
 * The properties to the component.
 */
export type DealersListProps = {
  leader?: ReactElement
  dealers: DealerDetailsInstance[]
  empty?: ReactElement
  trailer?: ReactElement
  padEnd?: boolean
}

function keyExtractor(item: DealerDetailsInstance) {
  return item.details.Id
}

export const DealersList: FC<DealersListProps> = ({ leader, dealers, empty, trailer, padEnd = true }) => {
  const theme = useThemeName()
  const { isSynchronizing, synchronizeUi } = useCache()

  const onPress = useCallback((dealer: DealerDetails) => {
    router.navigate({
      pathname: '/dealers/[id]',
      params: { id: dealer.Id },
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: DealerDetailsInstance }) => {
      return <DealerCard containerStyle={styles.item} dealer={item} onPress={onPress} />
    },
    [onPress]
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
      data={dealers}
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
