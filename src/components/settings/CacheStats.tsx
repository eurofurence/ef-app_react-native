import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/generic/atoms/Label'
import { StoreData, useRawCache } from '@/context/data/RawCache'
import { stringifyJsonSafe } from '@/context/data/RawCache.Utils'


function statFor(data: StoreData[keyof StoreData]): string {
    if (typeof data === 'object'
        && data !== null
        && Array.isArray((data as any).keys))
        return ((data as any).keys).length + ' items'
    else return stringifyJsonSafe(data)
}

export function CacheStats() {
    const { t } = useTranslation('Settings')
    const { cacheData } = useRawCache()

    return (
        <View className="p-4">
            <Label type="h3" variant="middle">
                {t('cacheStats')}
            </Label>
            <View className="mt-2">
                {Object.entries(cacheData).map(([store, item]) => (
                    <View key={store} className="flex-row justify-between py-1">
                        <Label type="regular">{store}:</Label>
                        <Label type="regular">{statFor(item)}</Label>
                    </View>
                ))}
            </View>
        </View>
    )
}
