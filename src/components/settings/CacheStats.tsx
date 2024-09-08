import moment from "moment-timezone";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { imagePrefetchComplete } from "../../hooks/sync/useImagePrefetch";
import { useSubscription } from "../../hooks/util/useSubscription";
import { useAppSelector } from "../../store";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";
import { Row } from "../generic/containers/Row";
import { useSynchronizer } from "../sync/SynchronizationProvider";

export const CacheStats = () => {
    const { t } = useTranslation("Settings");
    const sync = useSynchronizer();
    const imagesPrefetched = useSubscription(imagePrefetchComplete.value, (listener) => imagePrefetchComplete.addListener(listener));

    const cache = useAppSelector((state) => state.eurofurenceCache);
    return (
        <View testID="CacheStats">
            <Section title={t("cache.title")} subtitle={t("cache.subtitle", { time: moment.utc(cache.lastSynchronised).local().format("lll") })} />

            <Label mb={5}>{t("cache.images_prefetched", { state: imagesPrefetched })}</Label>
            <Label mb={5}>{t("cache.cache_state", { state: cache.state })}</Label>

            <Label>{t("cache.cache_item", { count: cache.announcements.ids.length, type: "announcements" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.events.ids.length, type: "event" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.eventRooms.ids.length, type: "room" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.eventDays.ids.length, type: "day" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.eventTracks.ids.length, type: "track" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.knowledgeGroups.ids.length, type: "knowledge group" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.knowledgeEntries.ids.length, type: "knowledge entry" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.dealers.ids.length, type: "dealer" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.maps.ids.length, type: "map" })}</Label>
            <Label>{t("cache.cache_item", { count: cache.images.ids.length, type: "image" })}</Label>

            <Row style={styles.container}>
                <Button onPress={sync.synchronizeUi} icon="sync" containerStyle={styles.button}>
                    {t("cache.synchronize")}
                </Button>
                <Button icon="trash-can-outline" containerStyle={styles.button} onPress={sync.clear}>
                    {t("cache.reset")}
                </Button>
            </Row>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
});
