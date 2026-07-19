import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { synchronize, useIsSynchronizing } from '@/data/hooks/useSynchronize'
import { vibrateAfter } from '@/util/vibrateAfter'

import { AnalyticsOptIns } from './AnalyticsOptIns'
import { CalendarSync } from './CalendarSync'
import { HiddenEvents } from './HiddenEvents'
import { LanguagePicker } from './LanguagePicker'
import { SettingContainer } from './SettingContainer'
import { ThemePicker } from './ThemePicker'
import { Warnings } from './Warnings'

export function UserSettings() {
  const { t } = useTranslation('Settings')
  const isSynchronizing = useIsSynchronizing()

  return (
    <View>
      {/* User visible settings, title */}
      <Section title={t('settingsSection')} icon='cog' />

      {/* Allow choosing theme */}
      <ThemePicker />

      {/* Options for analytics and crash reporting */}
      <AnalyticsOptIns />

      {/* Language selection mask */}
      <LanguagePicker />

      {/* Subscribe favorite events to the device calendar */}
      <CalendarSync />

      {/* Hidden events functionality, undo */}
      <HiddenEvents />

      {/* Warning settings */}
      <Warnings />

      {/* Force full sync (fetch all data) */}
      <SettingContainer>
        <Section
          title={t('sync.title')}
          subtitle={t('sync.subtitle')}
          icon='sync'
        />
        <Button
          disabled={isSynchronizing}
          onPress={() => vibrateAfter(synchronize())}
          icon='refresh'
        >
          {t('sync_full')}
        </Button>
      </SettingContainer>
    </View>
  )
}
