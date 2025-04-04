import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/DataCache'

export function RemoteMessages() {
    const { t } = useTranslation('Settings')
    const { getEntityValues } = useCache()
    const messages = getEntityValues('communications')

    return (
        <View className="p-4">
            <Label type="h3" variant="middle">
                {t('remoteMessages')}
            </Label>
            <View className="mt-2">
                {messages.map(item => (
                    <View key={item.Id} className="py-1">
                        <Label type="regular">
                            {item.Message}
                        </Label>
                    </View>
                ))}
                {messages.length === 0 && (
                    <Label type="regular">
                        {t('noRemoteMessages')}
                    </Label>
                )}
            </View>
        </View>
    )
}
