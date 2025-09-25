import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { ArtistsAlleyCard } from '@/components/artists-alley/ArtistsAlleyCard'
import { ArtistsAlleySection, ArtistsAlleySectionProps } from '@/components/artists-alley/ArtistsAlleySection'
import { SectionProps } from '@/components/generic/atoms/Section'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistAlleyDetails } from '@/context/data/types.details'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'

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
  onRefresh?: (() => void) | null | undefined
  refreshing?: boolean | null | undefined
}

function getItemType(item: SectionProps | ArtistAlleyDetails | TableRegistrationRecord) {
  return 'details' in item ? 'row' : 'sectionHeader'
}

function keyExtractor(item: SectionProps | ArtistAlleyDetails | TableRegistrationRecord) {
  return 'Id' in item ? item.Id : item.title
}

export const ArtistsAlleySectionedList: FC<ArtistsAlleySectionedListProps> = ({
  leader,
  items,
  empty,
  trailer,
  sticky = true,
  padEnd = true,
  onPress,
  onLongPress,
  onRefresh,
  refreshing,
}) => {
  const theme = useThemeName()
  const stickyIndices = useMemo(() => (sticky ? findIndices(items, (item) => 'title' in item) : undefined), [items, sticky])

  // Get translation function for accessibility
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'accessibility' })

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
      refreshing={refreshing}
      onRefresh={onRefresh}
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
      extraData={theme}
      accessibilityRole="list"
      accessibilityLabel={t('artists_alley_list')}
      accessibilityHint={t('refresh_list_hint')}
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
