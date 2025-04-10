import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/Cache'

export function ScheduledNotifications() {
  const { t } = useTranslation('Settings')
  const { getValue } = useCache()
  const notifications = getValue('notifications')

  return (
    <View className="p-4">
      <Label type="h3" variant="middle">
        {t('scheduledNotifications')}
      </Label>
      <View className="mt-2">
        {notifications?.map((item) => {
          return (
            <View key={item.recordId} className="py-1">
              <Label type="regular">
                {item.type} - {item.dateScheduledUtc}
              </Label>
            </View>
          )
        })}
        {!notifications?.length && <Label type="regular">{t('noScheduledNotifications')}</Label>}
      </View>
    </View>
  )
}
