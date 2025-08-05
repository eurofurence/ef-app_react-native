import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { formatDistanceToNow } from 'date-fns'

import { Header } from '@/components/generic/containers/Header'
import { Label } from '@/components/generic/atoms/Label'
import { AnnouncementList } from '@/components/announce/AnnouncementList'
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
    <Label type="h2" className="mt-8 mb-3">
      {t('noAnnouncements')}
    </Label>
  )

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('header')}</Header>
      <AnnouncementList announcements={announcementInstances} empty={empty} />
    </View>
  )
}
