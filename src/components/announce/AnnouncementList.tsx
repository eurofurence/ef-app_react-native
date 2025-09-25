import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { FC, ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { AnnouncementDetails } from '@/context/data/types.details'
import { useThemeName } from '@/hooks/themes/useThemeHooks'

import { AnnouncementCard, AnnouncementDetailsInstance } from './AnnouncementCard'

export type AnnouncementListProps = {
  leader?: ReactElement
  announcements: AnnouncementDetailsInstance[]
  empty?: ReactElement
  trailer?: ReactElement
  padEnd?: boolean
}

function keyExtractor(item: AnnouncementDetailsInstance) {
  return item.details.Id
}

export const AnnouncementList: FC<AnnouncementListProps> = ({ leader, announcements, empty, trailer, padEnd = true }) => {
  const { t } = useTranslation('Announcements')
  const theme = useThemeName()

  const onPress = useCallback(
    (announcement: AnnouncementDetails) =>
      router.navigate({
        pathname: '/announcements/[id]',
        params: { id: announcement.Id },
      }),
    []
  )

  const renderItem = useCallback(
    ({ item }: { item: AnnouncementDetailsInstance }) => {
      return <AnnouncementCard containerStyle={styles.item} announcement={item} onPress={onPress} />
    },
    [onPress]
  )

  return (
    <FlashList
      contentContainerStyle={padEnd ? styles.container : undefined}
      scrollEnabled={true}
      ListHeaderComponent={leader}
      ListFooterComponent={trailer}
      ListEmptyComponent={empty}
      data={announcements}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      extraData={theme}
      accessibilityRole="list"
      accessibilityLabel={t('accessibility.announcements_list')}
      accessibilityHint={t('accessibility.announcements_list_hint')}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 20,
  },
  container: {
    paddingBottom: 100,
  },
})
