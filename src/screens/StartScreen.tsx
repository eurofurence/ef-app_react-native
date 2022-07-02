import { Text, View } from "react-native";

import { LoadingIndicator } from "../components/Utilities/LoadingIndicator";
import { useGetAnnouncementsQuery, useGetDealersQuery, useGetEventByIdQuery, useGetEventsQuery } from "../store/eurofurence.service";
import { AnnouncementRecord, EnrichedDealerRecord, EventRecord } from "../store/eurofurence.types";

export const StartScreen = () => {
    const announcements: Query<AnnouncementRecord[]> = useGetAnnouncementsQuery();
    const events: Query<EventRecord[]> = useGetEventsQuery();
    const event: Query<EventRecord, string> = useGetEventByIdQuery("76430fe0-ece7-48c9-b8e6-fdbc3974ff64");
    const dealers: Query<EnrichedDealerRecord[]> = useGetDealersQuery();

    return (
        <View style={{ padding: 5 }}>
            {announcements.isFetching ? <LoadingIndicator /> : <Text>There are {announcements.data?.length} announcements</Text>}
            {events.isFetching ? <LoadingIndicator /> : <Text>There are {events.data?.length} events</Text>}
            {event.isFetching ? <LoadingIndicator /> : <Text>We have retrieved event {event.data.Title}</Text>}
            {dealers.isFetching ? <LoadingIndicator /> : <Text>We have {dealers.data.length} dealers</Text>}
        </View>
    );
};
