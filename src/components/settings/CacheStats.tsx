import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/generic/atoms/Label';
import { useDataCache } from '@/context/DataCacheProvider';

const STORE_NAMES = {
    THEME: "theme",
    ANNOUNCEMENTS: "announcements",
    NOTIFICATIONS: "notifications",
    DEALERS: "dealers",
    IMAGES: "images",
    SETTINGS: "settings",
    FUSE_SEARCH: "fuseSearch",
    EVENTS: "events",
    EVENT_DAYS: "eventDays",
    EVENT_ROOMS: "eventRooms",
    EVENT_TRACKS: "eventTracks",
    KNOWLEDGE_GROUPS: "knowledgeGroups",
    KNOWLEDGE_ENTRIES: "knowledgeEntries",
    MAPS: "maps",
    TIMETRAVEL: "timetravel",
    WARNINGS: "warnings",
    COMMUNICATIONS: "communications",
} as const;

export function CacheStats() {
    const { t } = useTranslation("Settings");
    const { getAllCacheSync } = useDataCache();
    
    const stats = React.useMemo(() => {
        const results: Record<string, number> = {};
        Object.values(STORE_NAMES).forEach(store => {
            const items = getAllCacheSync(store);
            results[store] = items.length;
        });
        return results;
    }, [getAllCacheSync]);

    return (
        <View className="p-4">
            <Label type="h3" variant="middle">
                {t("cacheStats")}
            </Label>
            <View className="mt-2">
                {Object.entries(stats).map(([store, count]) => (
                    <View key={store} className="flex-row justify-between py-1">
                        <Label type="regular">{store}:</Label>
                        <Label type="regular">{count}</Label>
                    </View>
                ))}
            </View>
        </View>
    );
} 