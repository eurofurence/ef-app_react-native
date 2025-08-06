import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import { DealerSection, DealerSectionProps } from './DealerSection'
import { DealerCard, DealerDetailsInstance } from './DealerCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { SectionProps } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { vibrateAfter } from '@/util/vibrateAfter'
import { useDealerCardInteractions } from '@/components/dealers/Dealers.common'

/**
 * The properties to the component.
 */
export type DealersSectionedListProps = {
  leader?: ReactElement
  dealersGroups: (DealerSectionProps | DealerDetailsInstance)[]
  empty?: ReactElement
  trailer?: ReactElement
  sticky?: boolean
  padEnd?: boolean
}

function getItemType(item: SectionProps | DealerDetailsInstance) {
  return 'details' in item ? 'row' : 'sectionHeader'
}

function keyExtractor(item: SectionProps | DealerDetailsInstance) {
  return 'details' in item ? item.details.Id : item.title
}

export const DealersSectionedList: FC<DealersSectionedListProps> = ({ leader, dealersGroups, empty, trailer, sticky = true, padEnd = true }) => {
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()
  const stickyIndices = useMemo(() => (sticky ? findIndices(dealersGroups, (item) => !('details' in item)) : undefined), [dealersGroups, sticky])
  const { onPress, onLongPress } = useDealerCardInteractions()

  const renderItem = useCallback(
    ({ item }: { item: SectionProps | DealerDetailsInstance }) => {
      if ('details' in item) {
        return <DealerCard containerStyle={styles.item} dealer={item} onPress={onPress} onLongPress={onLongPress} />
      } else {
        return <DealerSection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />
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
      data={dealersGroups}
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
