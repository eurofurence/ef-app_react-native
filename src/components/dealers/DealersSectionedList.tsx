import { FlashList } from '@shopify/flash-list'
import { type FC, type ReactElement, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet } from 'react-native'

import { useDealerCardInteractions } from '@/components/dealers/Dealers.common'
import type { SectionProps } from '@/components/generic/atoms/Section'
import { useCache } from '@/context/data/Cache'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { vibrateAfter } from '@/util/vibrateAfter'

import { DealerCard, type DealerDetailsInstance } from './DealerCard'
import { DealerSection, type DealerSectionProps } from './DealerSection'

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

export const DealersSectionedList: FC<DealersSectionedListProps> = ({
  leader,
  dealersGroups,
  empty,
  trailer,
  sticky = true,
  padEnd = true,
}) => {
  const { t } = useTranslation('Dealers')
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()
  const stickyIndices = useMemo(
    () =>
      sticky
        ? findIndices(dealersGroups, (item) => !('details' in item))
        : undefined,
    [dealersGroups, sticky]
  )
  const { onPress, onLongPress } = useDealerCardInteractions()

  const renderItem = useCallback(
    ({ item }: { item: SectionProps | DealerDetailsInstance }) => {
      if ('details' in item) {
        return (
          <DealerCard
            containerStyle={styles.item}
            dealer={item}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        )
      } else {
        return (
          <DealerSection
            style={styles.item}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
          />
        )
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
      accessibilityLabel={t('accessibility.dealers_sectioned_list')}
      accessibilityHint={t('accessibility.dealers_sectioned_list_hint')}
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
