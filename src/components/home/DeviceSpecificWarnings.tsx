import * as Device from 'expo-device'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { Label } from '../generic/atoms/Label'
import { Section } from '../generic/atoms/Section'
import { useWarningState } from '@/hooks/data/useWarningState'

// TODO: When showing warnings in Warnings.tsx, then going back to home, the warnings are not shown.
export const DeviceSpecificWarnings = () => {
  const { t } = useTranslation('Home', { keyPrefix: 'warnings' })
  const [scheduledNotifications] = useState(() => Platform.OS === 'android' || Platform.OS === 'ios')
  const [cacheImages] = useState(() => Platform.OS === 'android' || Platform.OS === 'ios')
  const pushNotifications = useMemo(() => scheduledNotifications && Device.isDevice, [scheduledNotifications])

  const { isHidden, hideWarning } = useWarningState('deviceWarningsHidden')

  // Return null while loading or if hidden
  if (isHidden === null || isHidden === true) {
    return null
  }

  if (!scheduledNotifications || !pushNotifications || !cacheImages) {
    return (
      <>
        <Section title={t('title')} subtitle={t('subtitle')} icon="information" />

        <Label type="para">
          {[!scheduledNotifications && t('no_notifications'), !pushNotifications && t('no_push_notifications'), !cacheImages && t('no_image_caching')].filter(Boolean).join('\n\n')}
          <Label variant="bold" color="secondary" onPress={hideWarning}>
            {' ' + t('hide')}
          </Label>
        </Label>
      </>
    )
  }

  return null
}
