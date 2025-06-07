import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { useThemeName } from '@/hooks/themes/useThemeHooks'

import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistsAlleyCard } from '@/components/artists-alley/ArtistsAlleyCard'

export type ArtistsAlleyListProps = {
  leader?: ReactElement
  items: TableRegistrationRecord[]
  empty?: ReactElement
  trailer?: ReactElement
  padEnd?: boolean
}

function keyExtractor(item: TableRegistrationRecord) {
  return item.Id
}

export const ArtistsAlleyList: FC<ArtistsAlleyListProps> = ({ leader, items, empty, trailer, padEnd = true }) => {
  const theme = useThemeName()

  const onPress = useCallback(
    (item: TableRegistrationRecord) =>
      router.navigate({
        pathname: '/artists-alley/[id]',
        params: { id: item.Id },
      }),
    []
  )

  const renderItem = useCallback(
    ({ item }: { item: TableRegistrationRecord }) => {
      return <ArtistsAlleyCard containerStyle={styles.item} item={item} onPress={onPress} />
    },
    [onPress]
  )

  return (
    <FlashList
      contentContainerStyle={padEnd ? styles.container : undefined}
      scrollEnabled={true}
      ListHeaderComponent={leader}
      ListFooterComponent={trailer}
      ListEmptyComponent={empty}
      data={items}
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
