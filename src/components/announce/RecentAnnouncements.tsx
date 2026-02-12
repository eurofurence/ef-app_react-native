import {
  addMinutes,
  formatDistanceToNow,
  isAfter,
  isBefore,
  subMinutes,
} from 'date-fns'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useCache } from '@/context/data/Cache'
import type { AnnouncementDetails } from '@/context/data/types.details'

import { Section } from '../generic/atoms/Section'
import { Button } from '../generic/containers/Button'

import { AnnouncementCard } from './AnnouncementCard'

const recentLimit = 2

export const RecentAnnouncements = ({ now }: { now: Date }) => {
  const { t } = useTranslation('Home')
  const { t: tAnnouncements } = useTranslation('Announcements')
  const { announcements } = useCache()

  const recent = useMemo(
    () =>
      announcements.filter(
        (item) =>
          isAfter(now, subMinutes(item.ValidFrom, 5)) &&
          isBefore(now, addMinutes(item.ValidUntil, 5))
      ),
    [announcements, now]
  )

  /**
   * Creates the announcement instance props for an upcoming or running announcement.
   * @param details The details to use.
   */
  const announcementInstanceForAny = (
    details: AnnouncementDetails
  ): AnnouncementDetailsInstance => {
    const time = formatDistanceToNow(details.ValidFrom, { addSuffix: true })
    return { details, time }
  }

  const recentAnnouncements = useMemo(
    () => recent.slice(0, recentLimit).map(announcementInstanceForAny),
    [recent]
  )

  // if (recentAnnouncements.length === 0) {
  //   return null
  // }

  return (
    <>
      <Section
        title={t('recent_announcements')}
        subtitle={t('announcementsTitle', { count: recent.length })}
        icon='newspaper'
      />
      <View
        style={styles.condense}
        accessibilityLabel={tAnnouncements(
          'accessibility.recent_announcements_section'
        )}
      >
        {recentAnnouncements.map((item) => (
          <AnnouncementCard
            key={item.details.Id}
            announcement={item}
            onPress={(announcement) =>
              router.navigate({
                pathname: '/announcements/[id]',
                params: { id: announcement.Id },
              })
            }
          />
        ))}
      </View>
      <Button
        style={styles.button}
        onPress={() => router.navigate('/announcements')}
        outline
        accessibilityLabel={tAnnouncements('accessibility.view_all_button')}
        accessibilityHint={tAnnouncements('accessibility.view_all_button_hint')}
        accessibilityRole='button'
      >
        {t('view_all_announcements')}
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  condense: {
    marginVertical: -15,
  },
  button: {
    marginTop: 20,
  },
})

// Define AnnouncementDetailsInstance type inside the file
type AnnouncementDetailsInstance = {
  details: AnnouncementDetails
  time: string
}
