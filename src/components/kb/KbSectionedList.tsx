import { FlashList } from '@shopify/flash-list'
import React, { FC, ReactElement, useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { KbSection } from './KbSection'
import { KbEntryCard } from './KbEntryCard'
import { useThemeBackground, useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { useCache } from '@/context/data/Cache'
import { EventDetails, KnowledgeEntryDetails, KnowledgeGroupDetails } from '@/context/data/types.details'

/**
 * The properties to the component.
 */
export type KbSectionedListProps = {
  leader?: ReactElement
  kbGroups: (KnowledgeGroupDetails | KnowledgeEntryDetails)[]
  select?: (event: EventDetails) => void
  empty?: ReactElement
  trailer?: ReactElement
  sticky?: boolean
  padEnd?: boolean
}

function getItemType(item: KnowledgeGroupDetails | KnowledgeEntryDetails) {
  return 'KnowledgeGroupId' in item ? 'row' : 'sectionHeader'
}

function keyExtractor(item: KnowledgeGroupDetails | KnowledgeEntryDetails) {
  return 'KnowledgeGroupId' in item ? item.Id : item.Id
}

export const KbSectionedList: FC<KbSectionedListProps> = ({ leader, kbGroups, empty, trailer, sticky = true, padEnd = true }) => {
  const theme = useThemeName()
  const { isSynchronizing, synchronizeUi } = useCache()
  const stickyIndices = useMemo(() => (sticky ? findIndices(kbGroups, (item) => !('KnowledgeGroupId' in item)) : undefined), [kbGroups, sticky])
  const sectionStyle = useThemeBackground('surface')

  const renderItem = useCallback(
    ({ item }: { item: KnowledgeGroupDetails | KnowledgeEntryDetails }) => {
      if ('KnowledgeGroupId' in item) {
        return (
          <KbEntryCard
            containerStyle={styles.item}
            entry={item}
            onPress={(entry) =>
              router.navigate({
                pathname: '/knowledge/[id]',
                params: { id: entry.Id },
              })
            }
          />
        )
      } else {
        return <KbSection style={[styles.item, sectionStyle]} title={item.Name} subtitle={item.Description} icon={item.FontAwesomeIconName ?? 'bookmark'} />
      }
    },
    [sectionStyle]
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
      data={kbGroups}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      renderItem={renderItem}
      estimatedItemSize={59}
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
