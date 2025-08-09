import { appStyles } from '@/components/AppStyles'
import { ArtistsAlleyContent } from '@/components/artists-alley/ArtistsAlleyContent'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useUserContext } from '@/context/auth/User'
import { useCache } from '@/context/data/Cache'
import { Redirect, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

export default function ArtistsAlleyDetail() {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'view' })
  const { t: a11y } = useTranslation('ArtistsAlley', { keyPrefix: 'accessibility' })
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useUserContext()
  const { artistAlley } = useCache()
  const artistAlleyEntry = artistAlley.dict[id]
  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  useEffect(() => {
    if (artistAlleyEntry) {
      setAnnouncementMessage(a11y('artists_alley_entry_loaded', { name: artistAlleyEntry.DisplayName }))
    } else {
      setAnnouncementMessage(a11y('artists_alley_entry_not_found'))
    }
  }, [artistAlleyEntry, a11y])

  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)
  if (!user || !isCheckedIn) return <Redirect href="/artists-alley" />

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        accessibilityLabel={a11y('artists_alley_entry_scroll')}
        accessibilityHint={a11y('artists_alley_entry_scroll_hint')}
      >
        <Header>
          {t('title')} – {artistAlleyEntry?.DisplayName ?? ''}
        </Header>
        <Floater containerStyle={appStyles.trailer}>
          <View ref={mainContentRef} accessibilityLabel={a11y('artists_alley_entry_content')} accessibilityRole="text">
            {artistAlleyEntry ? <ArtistsAlleyContent data={artistAlleyEntry} /> : null}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
