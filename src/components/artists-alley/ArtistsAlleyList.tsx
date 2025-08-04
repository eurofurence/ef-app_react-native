import { ArtistsAlleyCard, TableRegistrationInstance, tableRegistrationInstanceForAny } from '@/components/artists-alley/ArtistsAlleyCard'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

export type ArtistsAlleyListProps = {
  leader?: ReactElement
  items: TableRegistrationRecord[]
  empty?: ReactElement
  trailer?: ReactElement
  padEnd?: boolean
}

function keyExtractor(item: TableRegistrationInstance) {
  return item.details.Id
}

export const ArtistsAlleyList: FC<ArtistsAlleyListProps> = ({ leader, items, empty, trailer, padEnd = true }) => {
  const theme = useThemeName()
  const now = useNow()

  const instances = useMemo(() => {
    return items.map((item) => tableRegistrationInstanceForAny(item, now))
  }, [items, now])

  const onPress = useCallback(
    (item: TableRegistrationInstance) =>
      router.navigate({
        pathname: '/artists-alley/[id]',
        params: { id: item.details.Id },
      }),
    []
  )

  const renderItem = useCallback(
    ({ item }: { item: TableRegistrationInstance }) => {
      return <ArtistsAlleyCard style={styles.item} item={item} onPress={onPress} />
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
      data={instances}
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
