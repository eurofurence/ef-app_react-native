import { formatDistanceToNow } from 'date-fns'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { AnnouncementList } from '@/components/announce/AnnouncementList'
import { Label } from '@/components/generic/atoms/Label'
import { Search } from '@/components/generic/atoms/Search'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'
import type { AnnouncementDetails } from '@/context/data/types.details'
import { useFuseResults } from '@/hooks/searching/useFuseResults'

export default function AnnouncementsList() {
  const { t } = useTranslation('Announcements')
  const { announcements, searchAnnouncements } = useCache()
  const [filter, setFilter] = useState('')
  const search = useFuseResults(searchAnnouncements, filter)

  const announcementInstances = useMemo(() => {
    return (search ?? announcements).map((details: AnnouncementDetails) => ({
      details,
      time: formatDistanceToNow(details.ValidFrom, { addSuffix: true }),
    }))
  }, [announcements, search])

  const empty = (
    <View
      className='items-center justify-center p-8'
      accessibilityLabel={t('accessibility.empty_state')}
      accessibilityHint={t('accessibility.empty_state_hint')}
      accessibilityRole='text'
    >
      <Label type='h2' variant='middle'>
        {search ? t('noResults') : t('noAnnouncements')}
      </Label>
    </View>
  )

  return (
    <View
      style={StyleSheet.absoluteFill}
      accessibilityLabel={t('accessibility.main_container')}
    >
      <Header>{t('header')}</Header>
      <Search className='mx-2.5' filter={filter} setFilter={setFilter} />
      <AnnouncementList announcements={announcementInstances} empty={empty} />
    </View>
  )
}
