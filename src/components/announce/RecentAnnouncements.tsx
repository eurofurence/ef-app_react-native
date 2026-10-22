import { useLiveQuery } from '@tanstack/react-db'
import { addMinutes, isAfter, isBefore, subMinutes } from 'date-fns'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { announcementsFullCollection } from '@/data/collections/content/AnnouncementsFull'
import { useNow } from '@/hooks/time/useNow'
import { Section } from '../generic/atoms/Section'
import { Button } from '../generic/containers/Button'
import { AnnouncementCard } from './AnnouncementCard'

const recentLimit = 2

export function RecentAnnouncements() {
  const { t } = useTranslation('Home')
  const now = useNow()
  const { t: tAnnouncements } = useTranslation('Announcements')
  const { data: announcements } = useLiveQuery(announcementsFullCollection)

  const recent = useMemo(
    () =>
      announcements
        .filter(
          (item) =>
            isAfter(now, subMinutes(item.ValidFromDateTimeUtc, 5)) &&
            isBefore(now, addMinutes(item.ValidFromDateTimeUtc, 5))
        )
        .slice(0, recentLimit),
    [announcements, now]
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
        {recent.map((item) => (
          <AnnouncementCard
            key={item.Id}
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
