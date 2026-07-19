import { useLiveQuery } from '@tanstack/react-db'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { AnnouncementList } from '@/components/announce/AnnouncementList'
import { Label } from '@/components/generic/atoms/Label'
import { Header } from '@/components/generic/containers/Header'
import { announcementsFullCollection } from '@/data/collections/content/AnnouncementsFull'

export default function AnnouncementsList() {
  const { t } = useTranslation('Announcements')
  const { data: announcements } = useLiveQuery(announcementsFullCollection)

  const empty = (
    <View
      className='items-center justify-center p-8'
      accessibilityLabel={t('accessibility.empty_state')}
      accessibilityHint={t('accessibility.empty_state_hint')}
      accessibilityRole='text'
    >
      <Label type='h2' variant='middle'>
        {t('noAnnouncements')}
      </Label>
    </View>
  )

  return (
    <View
      style={StyleSheet.absoluteFill}
      accessibilityLabel={t('accessibility.main_container')}
    >
      <Header>{t('header')}</Header>
      <AnnouncementList announcements={announcements} empty={empty} />
    </View>
  )
}
