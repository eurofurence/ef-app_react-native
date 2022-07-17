import moment from "moment";
import { StyleSheet, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Row } from "../../components/Containers/Row";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppSelector } from "../../store";

export const CacheStats = () => {
    const sync = useSynchronizer();
    const cache = useAppSelector((state) => state.eurofurenceCache);
    return (
        <View testID={"CacheStats"}>
            <Section title={"Cache Stats"} subtitle={`Last sync: ${moment(cache.lastSynchronised).format("lll")} `} />

            <Label mb={5}>Current state: {cache.state}</Label>

            <Label>There are {cache.events.ids.length} events</Label>
            <Label>There are {cache.eventRooms.ids.length} rooms</Label>
            <Label>There are {cache.eventDays.ids.length} days</Label>
            <Label>There are {cache.eventTracks.ids.length} tracks</Label>
            <Label>There are {cache.knowledgeGroups.ids.length} knowledge groups</Label>
            <Label>There are {cache.knowledgeEntries.ids.length} knowledge entries</Label>
            <Label>There are {cache.dealers.ids.length} dealers</Label>
            <Label>There are {cache.maps.ids.length} maps</Label>
            <Label>There are {cache.images.ids.length} images</Label>

            <Row style={styles.container}>
                <Button onPress={sync.synchronize} icon={"sync"} style={styles.button}>
                    Synchronize
                </Button>
                <Button icon="trash-can-outline" style={styles.button} onPress={() => alert("To clean the cache you need to long press this button")} onLongPress={sync.clear}>
                    Clear cache
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
