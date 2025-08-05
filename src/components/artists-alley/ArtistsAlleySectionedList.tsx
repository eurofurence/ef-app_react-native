import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { SectionProps } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { vibrateAfter } from '@/util/vibrateAfter'
import { ArtistsAlleySection, ArtistsAlleySectionProps } from '@/components/artists-alley/ArtistsAlleySection'
import { ArtistsAlleyCard } from '@/components/artists-alley/ArtistsAlleyCard'
import { ArtistAlleyDetails } from '@/context/data/types.details'
import { TableRegistrationRecord } from '@/context/data/types.api'

/**
 * The properties to the component.
 */
export type ArtistsAlleySectionedListProps = {
  leader?: ReactElement
  items: (ArtistsAlleySectionProps | ArtistAlleyDetails | TableRegistrationRecord)[]
  empty?: ReactElement
  trailer?: ReactElement
  sticky?: boolean
  padEnd?: boolean
  onPress?: (item: ArtistAlleyDetails | TableRegistrationRecord) => void
  onLongPress?: (item: ArtistAlleyDetails | TableRegistrationRecord) => void
}

function getItemType(item: SectionProps | ArtistAlleyDetails | TableRegistrationRecord) {
  return 'details' in item ? 'row' : 'sectionHeader'
}

function keyExtractor(item: SectionProps | ArtistAlleyDetails | TableRegistrationRecord) {
  return 'Id' in item ? item.Id : item.title
}

export const ArtistsAlleySectionedList: FC<ArtistsAlleySectionedListProps> = ({ leader, items, empty, trailer, sticky = true, padEnd = true, onPress, onLongPress }) => {
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()
  const stickyIndices = useMemo(() => (sticky ? findIndices(items, (item) => 'title' in item) : undefined), [items, sticky])

  const renderItem = useCallback(
    ({ item }: { item: ArtistsAlleySectionProps | ArtistAlleyDetails | TableRegistrationRecord }) => {
      if ('Id' in item) {
        return <ArtistsAlleyCard containerStyle={styles.item} item={item} onPress={onPress} onLongPress={onLongPress} />
      } else {
        return <ArtistsAlleySection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />
      }
    },
    [onLongPress, onPress]
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
