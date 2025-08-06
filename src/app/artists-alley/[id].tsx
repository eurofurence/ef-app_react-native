import { Redirect, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { Floater } from '@/components/generic/containers/Floater'
import { appStyles } from '@/components/AppStyles'
import { useTranslation } from 'react-i18next'
import { useCache } from '@/context/data/Cache'
import { ArtistsAlleyContent } from '@/components/artists-alley/ArtistsAlleyContent'
import { useUserContext } from '@/context/auth/User'

export default function View() {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'view' })
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useUserContext()
  const { artistAlley } = useCache()
  const artistAlleyEntry = artistAlley.dict[id]

  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)
  if (!user || !isCheckedIn) return <Redirect href="/artists-alley" />

  return (
    <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]}>
      <Header>
        {t('title')} – {artistAlleyEntry?.DisplayName ?? ''}
      </Header>
      <Floater containerStyle={appStyles.trailer}>{artistAlleyEntry ? <ArtistsAlleyContent data={artistAlleyEntry} /> : null}</Floater>
    </ScrollView>
  )
}
