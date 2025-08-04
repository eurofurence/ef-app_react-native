import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { DealerCard, DealerDetailsInstance } from './DealerCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'
import { DealerDetails } from '@/context/data/types.details'
import { vibrateAfter } from '@/util/vibrateAfter'

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
  const { isSynchronizing, synchronize } = useCache()

  const onPress = useCallback((dealer: DealerDetails) => {
    router.navigate({
      pathname: '/dealers/[id]',
      params: { id: dealer.Id },
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: DealerDetailsInstance }) => {
      return <DealerCard style={styles.item} dealer={item} onPress={onPress} />
    },
    [onPress]
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
      data={dealers}
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
    marginHorizontal: 20,
  },
  container: {
    paddingBottom: 100,
  },
})
