import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

import { router } from 'expo-router'
import { LostAndFoundCard } from './LostAndFoundCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'
import { LostAndFoundRecord } from '@/context/data/types.api'
import { vibrateAfter } from '@/util/vibrateAfter'

/**
 * The properties to the component.
 */
export type LostAndFoundListProps = {
  leader?: ReactElement
  items: LostAndFoundRecord[]
  empty?: ReactElement
  trailer?: ReactElement
  padEnd?: boolean
}

function keyExtractor(item: LostAndFoundRecord) {
  return item.Id
}

export const LostAndFoundList: FC<LostAndFoundListProps> = ({ leader, items, empty, trailer, padEnd = true }) => {
  const theme = useThemeName()
  const { t } = useTranslation('LostAndFound')
  const { isSynchronizing, synchronize } = useCache()

  const onPress = useCallback((item: LostAndFoundRecord) => {
    router.navigate({
      pathname: '/lost-and-found/[id]',
      params: { id: item.Id },
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: LostAndFoundRecord }) => {
      return <LostAndFoundCard containerStyle={styles.item} item={item} onPress={() => onPress(item)} />
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
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={120}
      estimatedListSize={Dimensions.get('window')}
      extraData={theme}
      accessibilityLabel={t('accessibility.lost_found_list')}
      accessibilityHint={t('accessibility.lost_found_list_hint')}
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
