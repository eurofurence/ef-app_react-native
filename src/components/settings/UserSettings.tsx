import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ThemePicker } from './ThemePicker'
import { AnalyticsOptIns } from './AnalyticsOptIns'
import { LanguagePicker } from './LanguagePicker'
import { HiddenEvents } from './HiddenEvents'
import { Warnings } from './Warnings'
import { Section } from '@/components/generic/atoms/Section'

export function UserSettings() {
  const { t } = useTranslation('Settings')

  return (
    <View>
      {/* User visible settings, title */}
      <Section title={t('settingsSection')} icon="cog" />

      {/* Allow choosing theme */}
      <ThemePicker />

      {/* Options for analytics and crash reporting */}
      <AnalyticsOptIns />

      {/* Language selection mask */}
      <LanguagePicker />

      {/* Hidden events functionality, undo */}
      <HiddenEvents />

      {/* Warning settings */}
      <Warnings />
    </View>
  )
}
