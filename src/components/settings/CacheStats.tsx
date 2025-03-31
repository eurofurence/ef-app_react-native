import React, { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/generic/atoms/Label";
import { STORE_NAMES, useDataCache } from "@/context/DataCacheProvider";

export function CacheStats() {
    const { t } = useTranslation("Settings");
    const { getAllCacheSync } = useDataCache();

    const stats = useMemo(() => {
        const results: Record<string, number> = {};
        Object.values(STORE_NAMES).forEach((store) => {
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
