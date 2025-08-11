import React, { Fragment, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/generic/atoms/Section'
import { useAuthContext } from '@/context/auth/Auth'
import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/Cache'
import { getDevicePushToken } from '@/hooks/tokens/useTokenManager'
import { useUserContext } from '@/context/auth/User'

export function DevValues() {
  const { t } = useTranslation('Settings', { keyPrefix: 'dev_values' })
  const { tokenResponse, idData } = useAuthContext()
  const { user } = useUserContext()
  const { getValue } = useCache()
  const notifications = getValue('notifications')

  const [devicePushToken, setDevicePushToken] = useState<any | null>(null)

  useEffect(() => {
    getDevicePushToken().then((value) => setDevicePushToken(value))
  }, [])

  const { data } = useCache()

  return (
    <View className="p-4">
      <Section title={t('title')} subtitle={t('subtitle')} />

      <Label className="mt-5" type="h3">
        {t('claims')}
      </Label>
      <Label className="ml-2">{idData ? JSON.stringify(idData, null, 2) : 'None'}</Label>
      <Label className="mt-5" type="h3">
        {t('user')}
      </Label>
      <Label className="ml-2">{user ? JSON.stringify(user, null, 2) : 'None'}</Label>

      <Label className="mt-5" type="h3">
        {t('notifications')}
      </Label>
      <View>
        {notifications?.map((item) => {
          return (
            <View key={item.recordId} className="py-1 ml-2">
              <Label type="regular">
                {item.type} - {item.dateScheduledUtc}
              </Label>
            </View>
          )
        })}
        {!notifications?.length && (
          <Label type="regular" className="ml-2">
            {t('noScheduledNotifications')}
          </Label>
        )}
      </View>
      <Label className="mt-5" type="h3">
        {t('token_data')}
      </Label>
      <Label className="ml-2">{tokenResponse ? JSON.stringify(tokenResponse, null, 2) : 'None'}</Label>

      <Label className="mt-5" type="h3">
        {t('device_push_token')}
      </Label>
      <Label className="ml-2">{devicePushToken ? JSON.stringify(devicePushToken, null, 2) : 'None'}</Label>

      <Label className="mt-5" type="h3">
        {t('cache_values')}
      </Label>
      {Object.entries(data).map(([key, value]) => (
        <Fragment key={key}>
          <Label className="mt-3" type="h4">
            {key}
          </Label>
          {Array.isArray(value) ? (
            <Label className="ml-2">Array of length {value.length}</Label>
          ) : (
            <Label className="ml-2">{value ? JSON.stringify(value, null, 2) : 'None'}</Label>
          )}
        </Fragment>
      ))}
    </View>
  )
}
