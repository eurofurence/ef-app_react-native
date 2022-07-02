import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { LoadingIndicator } from "./components/Utilities/LoadingIndicator";
import { useGetAnnouncementsQuery, useGetEventByIdQuery, useGetEventsQuery } from "./store/eurofurence.service";
import { AnnouncementRecord, EventRecord } from "./store/eurofurence.types";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx
 * @constructor
 */
export default function App() {
    const announcements: Query<AnnouncementRecord[]> = useGetAnnouncementsQuery();
    const events: Query<EventRecord[]> = useGetEventsQuery();
    const event: Query<EventRecord, string> = useGetEventByIdQuery("76430fe0-ece7-48c9-b8e6-fdbc3974ff64");

    return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <StatusBar style="auto" />
            {announcements.isFetching ? <LoadingIndicator /> : <Text>There are {announcements.data?.length} announcements</Text>}
            {events.isFetching ? <LoadingIndicator /> : <Text>There are {events.data?.length} events</Text>}
            {event.isFetching ? <LoadingIndicator /> : <Text>We have retrieved event {event.data.Title}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
