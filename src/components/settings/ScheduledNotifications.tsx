import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/generic/atoms/Label';
import { useDataCache } from '@/context/DataCacheProvider';
import { Notification } from '@/store/background/slice';

export function ScheduledNotifications() {
    const { t } = useTranslation("Settings");
    const { getAllCacheSync } = useDataCache();
    const notifications = getAllCacheSync("notifications");
    
    return (
        <View className="p-4">
            <Label type="h3" variant="middle">
                {t("scheduledNotifications")}
            </Label>
            <View className="mt-2">
                {notifications.map(item => {
                    const notification = item.data as Notification;
                    return (
                        <View key={notification.recordId} className="py-1">
                            <Label type="regular">
                                {notification.type} - {notification.dateScheduledUtc}
                            </Label>
                        </View>
                    );
                })}
                {notifications.length === 0 && (
                    <Label type="regular">
                        {t("noScheduledNotifications")}
                    </Label>
                )}
            </View>
        </View>
    );
} 