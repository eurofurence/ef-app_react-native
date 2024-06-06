import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../components/app/AppStyles";
import { AnnouncementCard } from "../components/app/announce/AnnouncementCard";
import { useAppRoute } from "../hooks/nav/useAppNavigation";
import { useAppSelector } from "../store";
import { announcementsSelectors } from "../store/eurofurence.selectors";

export type AnnouncementItemParams = {
    id: string;
};
export const AnnouncementItem = () => {
    const safe = useSafeAreaInsets();
    const route = useAppRoute("Announcement");
    const announcement = useAppSelector((state) => announcementsSelectors.selectById(state, route.params.id));

    // TODO: Maybe wait force fetch??

    return (
        <ScrollView style={[appStyles.abs, safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            {!announcement ? null : <AnnouncementCard announcement={announcement} />}
        </ScrollView>
    );
};
