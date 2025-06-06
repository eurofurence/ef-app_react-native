import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Floater } from '@/components/generic/containers/Floater'
import { UserSettings } from '@/components/settings/UserSettings'
import { TimeTravel } from '@/components/settings/TimeTravel'
import { DevButtons } from '@/components/settings/DevButtons'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'
import { DevValues } from '@/components/settings/DevValues'

export default function SettingsPage() {
  const { getValue } = useCache()
  const { t } = useTranslation('Settings')

  const showDevMenu = getValue('settings').devMenu

  return (
    <>
      <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll className="flex-1">
        <Header>{t('header')}</Header>
        <Floater contentStyle={styles.content}>
          <UserSettings />

          {showDevMenu && (
            <>
              <TimeTravel />
              <DevButtons />
              <DevValues />
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
