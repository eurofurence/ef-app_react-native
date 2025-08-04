import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { SectionProps } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { vibrateAfter } from '@/util/vibrateAfter'
import { ArtistsAlleySection, ArtistsAlleySectionProps } from '@/components/artists-alley/ArtistsAlleySection'
import { ArtistsAlleyCard, TableRegistrationInstance } from '@/components/artists-alley/ArtistsAlleyCard'

/**
 * The properties to the component.
 */
export type ArtistsAlleySectionedListProps = {
  leader?: ReactElement
  items: (ArtistsAlleySectionProps | TableRegistrationInstance)[]
  empty?: ReactElement
  trailer?: ReactElement
  sticky?: boolean
  padEnd?: boolean
}

function getItemType(item: SectionProps | TableRegistrationInstance) {
  return 'details' in item ? 'row' : 'sectionHeader'
}

function keyExtractor(item: SectionProps | TableRegistrationInstance) {
  return 'details' in item ? item.details.Id : item.title
}

export const ArtistsAlleySectionedList: FC<ArtistsAlleySectionedListProps> = ({ leader, items, empty, trailer, sticky = true, padEnd = true }) => {
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()
  const stickyIndices = useMemo(() => (sticky ? findIndices(items, (item) => 'title' in item) : undefined), [items, sticky])

  const onPress = useCallback((item: TableRegistrationInstance) => {
    router.navigate({
      pathname: '/artists-alley/[id]',
      params: { id: item.details.Id },
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: ArtistsAlleySectionProps | TableRegistrationInstance }) => {
      if ('title' in item) {
        return <ArtistsAlleySection style={styles.section} title={item.title} subtitle={item.subtitle} icon={item.icon} />
      } else {
        return <ArtistsAlleyCard style={styles.item} item={item} onPress={onPress} />
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
  section: {
    paddingHorizontal: 20,
  },
  item: {
    marginHorizontal: 20,
  },
  container: {
    paddingBottom: 100,
  },
})
