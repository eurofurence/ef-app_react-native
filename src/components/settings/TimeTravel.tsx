import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/generic/atoms/Label';
import { useDataCache } from '@/context/DataCacheProvider';

export function TimeTravel() {
    const { t } = useTranslation("Settings");
    const { getCacheSync, saveCache } = useDataCache();
    const timeOffset = getCacheSync("timetravel", "timeOffset")?.data ?? 0;
    
    return (
        <View className="p-4">
            <Label type="h3" variant="middle">
                {t("timeTravel")}
            </Label>
            <View className="mt-2">
                <Label type="regular">
                    {t("currentOffset")}: {timeOffset}ms
                </Label>
                {/* TODO: Add slider or input to adjust time offset */}
            </View>
        </View>
    );
} 