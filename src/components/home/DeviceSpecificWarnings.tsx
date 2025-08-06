import * as Device from 'expo-device'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { Label } from '../generic/atoms/Label'
import { useWarningState } from '@/hooks/data/useWarningState'
import { Icon } from '@/components/generic/atoms/Icon'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

// TODO: When showing warnings in Warnings.tsx, then going back to home, the warnings are not shown.
export const DeviceSpecificWarnings = () => {
  const { t } = useTranslation('Home', { keyPrefix: 'warnings' })
  const iconColor = useThemeColorValue('important')
  const [scheduledNotifications] = useState(() => Platform.OS === 'android' || Platform.OS === 'ios')
  const [cacheImages] = useState(() => Platform.OS === 'android' || Platform.OS === 'ios')
  const pushNotifications = useMemo(() => scheduledNotifications && Device.isDevice, [scheduledNotifications])

  const { isHidden, hideWarning } = useWarningState('deviceWarningsHidden')

  // Return null while loading or if hidden
  if (isHidden === null || isHidden) {
    return null
  }

  if (!scheduledNotifications || !pushNotifications || !cacheImages) {
    return (
      <>
        <View className="pt-8 pb-4 self-stretch">
          <View className="self-stretch flex-row items-center">
            <Icon color={iconColor} name="information" size={24} />
            <Label className="ml-2 flex-1" type="h2" color="important" ellipsizeMode="tail">
              {t('title')}
            </Label>
            <Label className="leading-8" type="compact" variant="bold" color="secondary" onPress={hideWarning}>
              {t('hide')}
            </Label>
          </View>
        </View>

        <Label type="para">
          {[!scheduledNotifications && t('no_notifications'), !pushNotifications && t('no_push_notifications'), !cacheImages && t('no_image_caching')].filter(Boolean).join('\n\n')}
        </Label>
      </>
    )
  }

  return null
}
