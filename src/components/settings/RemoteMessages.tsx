import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/generic/atoms/Label'
import { useAuthData } from '@/context/auth/AuthData'

export function RemoteMessages() {
  const { t } = useTranslation('Settings')
  const { communications } = useAuthData()
  const ordered = useMemo(() => {
    if (!communications) return []
    else return [...communications].sort((a, b) => -a.CreatedDateTimeUtc.localeCompare(b.CreatedDateTimeUtc))
  }, [communications])

  return (
    <View className="p-4">
      <Label type="h3" variant="middle">
        {t('remoteMessages')}
      </Label>
      <View className="mt-2">
        {ordered.map((item) => (
          <View key={item.Id} className="py-1">
            <Label type="regular">{item.Message}</Label>
          </View>
        ))}
        {ordered.length === 0 && <Label type="regular">{t('noRemoteMessages')}</Label>}
      </View>
    </View>
  )
}
