import moment from "moment";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Row } from "../../components/Containers/Row";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppSelector } from "../../store";

export const CacheStats = () => {
    const { t } = useTranslation("Settings");
    const sync = useSynchronizer();
    const cache = useAppSelector((state) => state.eurofurenceCache);
    return (
        <View testID={"CacheStats"}>
            <Section title={t("cache.title")} subtitle={t("cache.subtitle", { time: moment(cache.lastSynchronised).format("lll") })} />

            <Label mb={5}>{t("cache.cache_state", { state: cache.state })}</Label>

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
                <Button onPress={sync.synchronize} icon={"sync"} style={styles.button}>
                    {t("cache.synchronize")}
                </Button>
                <Button icon="trash-can-outline" style={styles.button} onPress={() => alert(t("cache.reset_alert"))} onLongPress={sync.clear}>
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
        paddingHorizontal: 5,
    },
});
