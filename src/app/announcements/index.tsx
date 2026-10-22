import { inArray, or, useLiveQuery } from '@tanstack/react-db'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { AnnouncementList } from '@/components/announce/AnnouncementList'
import { Label } from '@/components/generic/atoms/Label'
import { Search } from '@/components/generic/atoms/Search'
import { Header } from '@/components/generic/containers/Header'
import { announcementsFullCollection } from '@/data/collections/content/AnnouncementsFull'
import { useSearchIds } from '@/data/searching/useSearch'

export default function AnnouncementsList() {
  const { t } = useTranslation('Announcements')
  const [query, setQuery] = useState('')
  const results = useSearchIds(announcementsFullCollection, query)
  const { data: announcements } = useLiveQuery({
    id: `announcements`,
    query: (q) =>
      q
        .from({ item: announcementsFullCollection })
        .where(({ item }) => or(!results, inArray(item.Id, results))),
  })

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
      <Search className='mx-2.5' filter={query} setFilter={setQuery} />
      <AnnouncementList announcements={announcements} empty={empty} />
    </View>
  )
}
