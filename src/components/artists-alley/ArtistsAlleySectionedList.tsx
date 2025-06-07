import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { SectionProps } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { vibrateAfter } from '@/util/vibrateAfter'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistsAlleySection, ArtistsAlleySectionProps } from '@/components/artists-alley/ArtistsAlleySection'
import { ArtistsAlleyCard } from '@/components/artists-alley/ArtistsAlleyCard'

/**
 * The properties to the component.
 */
export type ArtistsAlleySectionedListProps = {
  leader?: ReactElement
  items: (ArtistsAlleySectionProps | TableRegistrationRecord)[]
  empty?: ReactElement
  trailer?: ReactElement
  sticky?: boolean
  padEnd?: boolean
}

function getItemType(item: SectionProps | TableRegistrationRecord) {
  return 'title' in item ? 'sectionHeader' : 'row'
}

function keyExtractor(item: SectionProps | TableRegistrationRecord) {
  return 'title' in item ? item.title : item.Id
}

export const ArtistsAlleySectionedList: FC<ArtistsAlleySectionedListProps> = ({ leader, items, empty, trailer, sticky = true, padEnd = true }) => {
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()
  const stickyIndices = useMemo(() => (sticky ? findIndices(items, (item) => 'title' in item) : undefined), [items, sticky])

  const onPress = useCallback((item: TableRegistrationRecord) => {
    router.navigate({
      pathname: '/artists-alley/[id]',
      params: { id: item.Id },
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: ArtistsAlleySectionProps | TableRegistrationRecord }) => {
      if ('title' in item) {
        return <ArtistsAlleySection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />
      } else {
        return <ArtistsAlleyCard containerStyle={styles.item} item={item} onPress={onPress} />
      }
    },
    [onPress]
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
      data={items}
      getItemType={getItemType}
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
