import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Floater } from '@/components/generic/containers/Floater'
import { UserSettings } from '@/components/settings/UserSettings'
import { CacheStats } from '@/components/settings/CacheStats'
import { TimeTravel } from '@/components/settings/TimeTravel'
import { ScheduledNotifications } from '@/components/settings/ScheduledNotifications'
import { RemoteMessages } from '@/components/settings/RemoteMessages'
import { DevButtons } from '@/components/settings/DevButtons'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'

export default function SettingsPage() {
  const { getValue } = useCache()
  const { t } = useTranslation('Settings')

  const showDevMenu = Boolean(getValue('settings').devMenu)

  return (
    <>
      <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll className="flex-1">
        <Header>{t('header')}</Header>
        <Floater contentStyle={styles.content}>
          <UserSettings />

          {showDevMenu && (
            <>
              <CacheStats />
              <TimeTravel />
              <ScheduledNotifications />
              <RemoteMessages />
              <DevButtons />
            </>
          )}
        </Floater>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    marginBottom: 16, // Equivalent to appStyles.trailer
  },
})
