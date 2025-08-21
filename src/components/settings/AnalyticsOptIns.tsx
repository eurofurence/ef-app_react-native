import Checkbox from 'expo-checkbox'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { Pressable } from '@/components/generic/Pressable'
import { useCache } from '@/context/data/Cache'

import { SettingContainer } from './SettingContainer'

/**
 * Analytics opt-in section with a checkbox to allow analytics.
 */
export const AnalyticsOptIns = () => {
  const { t } = useTranslation('Settings')
  const { data, setValue } = useCache()
  const settings = data.settings

  const analyticsEnabled = settings.analyticsEnabled ?? false

  const setAnalytics = (enabled: boolean) =>
    setValue('settings', (current) => ({
      ...current,
      analyticsEnabled: enabled,
    }))

  return (
    <SettingContainer>
      <Pressable onPress={() => setAnalytics(!analyticsEnabled)} hitSlop={16}>
        <View className="flex-row items-center">
          <View className="flex-1 mr-2">
            <Label variant="bold">{t('allowAnalytics')}</Label>
            <Label variant="narrow">{t('allowAnalyticsSubtitle')}</Label>
          </View>

          <Checkbox value={analyticsEnabled} />
        </View>
      </Pressable>
    </SettingContainer>
  )
}
