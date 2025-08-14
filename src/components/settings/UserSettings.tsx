import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { useCache } from '@/context/data/Cache'
import { vibrateAfter } from '@/util/vibrateAfter'

import { AnalyticsOptIns } from './AnalyticsOptIns'
import { HiddenEvents } from './HiddenEvents'
import { LanguagePicker } from './LanguagePicker'
import { ThemePicker } from './ThemePicker'
import { Warnings } from './Warnings'

export function UserSettings() {
  const { t } = useTranslation('Settings')
  const { synchronize, isSynchronizing } = useCache()

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

      {/* Force full sync (fetch all data) */}
      <Button disabled={isSynchronizing} onPress={() => vibrateAfter(synchronize({ full: true }))} icon="refresh">
        {t('sync_full')}
      </Button>
    </View>
  )
}
