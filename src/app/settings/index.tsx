import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { DevButtons } from '@/components/settings/DevButtons'
import { DevValues } from '@/components/settings/DevValues'
import { TimeTravel } from '@/components/settings/TimeTravel'
import { UserSettings } from '@/components/settings/UserSettings'
import { useCache } from '@/context/data/Cache'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

export default function SettingsPage() {
  const { getValue } = useCache()
  const { t } = useTranslation('Settings')
  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  const showDevMenu = getValue('settings').devMenu

  useEffect(() => {
    setAnnouncementMessage(t('accessibility.settings_page_loaded'))
  }, [t])

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        className="flex-1"
        accessibilityLabel={t('accessibility.settings_scroll')}
        accessibilityHint={t('accessibility.settings_scroll_hint')}
      >
        <Header>{t('header')}</Header>
        <Floater contentStyle={styles.content}>
          <View ref={mainContentRef} accessibilityLabel={t('accessibility.settings_content')} accessibilityRole="text">
            <UserSettings />

            {showDevMenu && (
              <>
                <TimeTravel />
                <DevButtons />
                <DevValues />
              </>
            )}
          </View>
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
