import { formatDistanceToNow } from 'date-fns'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { AnnouncementList } from '@/components/announce/AnnouncementList'
import { Label } from '@/components/generic/atoms/Label'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'
import { AnnouncementDetails } from '@/context/data/types.details'

export default function AnnouncementsList() {
  const { t } = useTranslation('Announcements')
  const { announcements } = useCache()

  const announcementInstances = useMemo(() => {
    return announcements.map((details: AnnouncementDetails) => ({
      details,
      time: formatDistanceToNow(details.ValidFrom, { addSuffix: true }),
    }))
  }, [announcements])

  const empty = (
    <Label type="h2" className="mt-8 mb-3" accessibilityLabel={t('accessibility.empty_state')} accessibilityHint={t('accessibility.empty_state_hint')} accessibilityRole="alert">
      {t('noAnnouncements')}
    </Label>
  )

  return (
    <View style={StyleSheet.absoluteFill} accessibilityLabel={t('accessibility.main_container')}>
      <Header>{t('header')}</Header>
      <AnnouncementList announcements={announcementInstances} empty={empty} />
    </View>
  )
}
