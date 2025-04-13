import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback } from 'react'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'
import { AnnouncementCard, AnnouncementDetailsInstance } from './AnnouncementCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'

import { AnnouncementDetails } from '@/context/data/types.details'

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
  const theme = useThemeName()

  const onPress = useCallback(
    (announcement: AnnouncementDetails) =>
      router.navigate({
        pathname: '/announcements/[announcementId]',
        params: { announcementId: announcement.Id },
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
