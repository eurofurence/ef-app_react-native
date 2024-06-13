import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../components/AppStyles";
import { AnnouncementCard } from "../components/announce/AnnouncementCard";
import { Label } from "../components/generic/atoms/Label";
import { MarkdownContent } from "../components/generic/atoms/MarkdownContent";
import { Floater } from "../components/generic/containers/Floater";
import { Header } from "../components/generic/containers/Header";
import { useAppRoute } from "../hooks/nav/useAppNavigation";
import { useAppSelector } from "../store";
import { announcementsSelectors } from "../store/eurofurence.selectors";

export type AnnouncementItemParams = {
    id: string;
};
export const AnnouncementItem = () => {
    const route = useAppRoute("Announcement");
    const announcement = useAppSelector((state) => announcementsSelectors.selectById(state, route.params.id));

    // TODO: Maybe wait force fetch??

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{announcement?.Title ?? "Viewing announcement"}</Header>
            <Floater contentStyle={appStyles.trailer}>
                {!announcement ? null : (
                    <>
                        <View style={styles.margin}>
                            <Label type={"caption"}>
                                {announcement.Area} - {announcement.Author}
                            </Label>
                        </View>

                        <MarkdownContent>{announcement.Content}</MarkdownContent>

                        {announcement.Image && <Image source={announcement.Image.FullUrl} style={styles.image} />}
                    </>
                )}
            </Floater>
            {!announcement ? null : <AnnouncementCard announcement={announcement} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    margin: {
        marginBottom: 5,
    },
    image: {
        width: "100%",
        height: "auto",
    },
});
