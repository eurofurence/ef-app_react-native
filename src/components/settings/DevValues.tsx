import React, { Fragment, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import * as SecureStore from '@/util/secureStorage'
import { Section } from '@/components/generic/atoms/Section'
import { useAuthContext } from '@/context/auth/Auth'
import { TokenResponseConfig } from 'expo-auth-session'
import { Label } from '@/components/generic/atoms/Label'
import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { useCache } from '@/context/data/Cache'
import { getDevicePushToken } from '@/hooks/tokens/useTokenManager'

export function DevValues() {
  const { t } = useTranslation('Settings', { keyPrefix: 'dev_values' })
  const { accessToken, claims } = useAuthContext()
  const { data: user } = useUserSelfQuery()
  const { getValue } = useCache()
  const notifications = getValue('notifications')

  const [tokenData, setTokenData] = useState<TokenResponseConfig | null>(null)
  const [devicePushToken, setDevicePushToken] = useState<any | null>(null)

  useEffect(() => {
    SecureStore.getItemAsync('tokenData').then((value) => setTokenData(value ? JSON.parse(value) : null))
  }, [accessToken])

  useEffect(() => {
    getDevicePushToken().then((value) => setDevicePushToken(value))
  }, [])

  const { data } = useCache()

  return (
    <View className="p-4">
      <Section title={t('title')} subtitle={t('subtitle')} />

      <Label mt={20} type="h3">
        {t('claims')}
      </Label>
      <Label ml={8}>{claims ? JSON.stringify(claims, null, 2) : 'None'}</Label>
      <Label mt={20} type="h3">
        {t('user')}
      </Label>
      <Label ml={8}>{user ? JSON.stringify(user, null, 2) : 'None'}</Label>

      <Label mt={20} type="h3">
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
          <Label type="regular" ml={8}>
            {t('noScheduledNotifications')}
          </Label>
        )}
      </View>
      <Label mt={20} type="h3">
        {t('token_data')}
      </Label>
      <Label ml={8}>{tokenData ? JSON.stringify(tokenData, null, 2) : 'None'}</Label>

      <Label mt={20} type="h3">
        {t('device_push_token')}
      </Label>
      <Label ml={8}>{devicePushToken ? JSON.stringify(devicePushToken, null, 2) : 'None'}</Label>

      <Label mt={20} type="h3">
        {t('cache_values')}
      </Label>
      {Object.entries(data).map(([key, value]) => (
        <Fragment key={key}>
          <Label mt={10} type="h4">
            {key}
          </Label>
          {Array.isArray(value) ? <Label ml={8}>Array of length {value.length}</Label> : <Label ml={8}>{value ? JSON.stringify(value, null, 2) : 'None'}</Label>}
        </Fragment>
      ))}
    </View>
  )
}
