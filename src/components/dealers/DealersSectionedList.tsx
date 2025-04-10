import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { DealerSection, DealerSectionProps } from './DealerSection'
import { DealerCard, DealerDetailsInstance } from './DealerCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { DealerDetails } from '@/context/data/types'
import { SectionProps } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'

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
  const { isSynchronizing, synchronizeUi } = useCache()
  const stickyIndices = useMemo(() => (sticky ? findIndices(dealersGroups, (item) => !('details' in item)) : undefined), [dealersGroups, sticky])

  const onPress = useCallback((dealer: DealerDetails) => {
    router.navigate({
      pathname: '/dealers/[id]',
      params: { id: dealer.Id },
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: SectionProps | DealerDetailsInstance }) => {
      if ('details' in item) {
        return <DealerCard containerStyle={styles.item} dealer={item} onPress={onPress} />
      } else {
        return <DealerSection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />
      }
    },
    [onPress]
  )

  return (
    <FlashList
      refreshing={isSynchronizing}
      onRefresh={synchronizeUi}
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
