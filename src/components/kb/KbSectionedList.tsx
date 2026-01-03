import { FlashList } from '@shopify/flash-list'
import { type FC, type ReactElement, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet } from 'react-native'

import { useKbEntryCardInteractions } from '@/components/kb/KbEntry.common'
import { useCache } from '@/context/data/Cache'
import type {
  KnowledgeEntryDetails,
  KnowledgeGroupDetails,
} from '@/context/data/types.details'
import { useThemeBackground, useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { vibrateAfter } from '@/util/vibrateAfter'

import { KbEntryCard } from './KbEntryCard'
import { KbSection } from './KbSection'

/**
 * The properties to the component.
 */
export type KbSectionedListProps = {
  leader?: ReactElement
  kbGroups: (KnowledgeGroupDetails | KnowledgeEntryDetails)[]
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

export const KbSectionedList: FC<KbSectionedListProps> = ({
  leader,
  kbGroups,
  empty,
  trailer,
  sticky = true,
  padEnd = true,
}) => {
  const theme = useThemeName()
  const { t } = useTranslation('KnowledgeGroups')
  const { isSynchronizing, synchronize } = useCache()
  const stickyIndices = useMemo(
    () =>
      sticky
        ? findIndices(kbGroups, (item) => !('KnowledgeGroupId' in item))
        : undefined,
    [kbGroups, sticky]
  )
  const sectionStyle = useThemeBackground('surface')

  const { onPress } = useKbEntryCardInteractions()

  const renderItem = useCallback(
    ({ item }: { item: KnowledgeGroupDetails | KnowledgeEntryDetails }) => {
      if ('KnowledgeGroupId' in item) {
        return (
          <KbEntryCard
            containerStyle={styles.item}
            entry={item}
            onPress={onPress}
          />
        )
      } else {
        return (
          <KbSection
            style={[styles.item, sectionStyle]}
            title={item.Name}
            subtitle={item.Description}
            icon={item.FontAwesomeIconName ?? 'bookmark'}
          />
        )
      }
    },
    [onPress, sectionStyle]
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
      data={kbGroups}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      renderItem={renderItem}
      estimatedItemSize={59}
      estimatedListSize={Dimensions.get('window')}
      extraData={theme}
      accessibilityLabel={t('accessibility.kb_sectioned_list')}
      accessibilityHint={t('accessibility.kb_sectioned_list_hint')}
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
