import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet } from 'react-native'

import { useDealerCardInteractions } from '@/components/dealers/Dealers.common'
import { useCache } from '@/context/data/Cache'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { vibrateAfter } from '@/util/vibrateAfter'

import { DealerCard, DealerDetailsInstance } from './DealerCard'

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
  const { t } = useTranslation('Dealers')
  const theme = useThemeName()
  const { isSynchronizing, synchronize } = useCache()
  const { onPress, onLongPress } = useDealerCardInteractions()

  const renderItem = useCallback(
    ({ item }: { item: DealerDetailsInstance }) => {
      return <DealerCard containerStyle={styles.item} dealer={item} onPress={onPress} onLongPress={onLongPress} />
    },
    [onLongPress, onPress]
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
      accessibilityLabel={t('accessibility.dealers_list')}
      accessibilityHint={t('accessibility.dealers_list_hint')}
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
