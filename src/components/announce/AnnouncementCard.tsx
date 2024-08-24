import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { AnnouncementDetails } from "../../store/eurofurence/types";
import { Image } from "../generic/atoms/Image";
import { Label } from "../generic/atoms/Label";
import { MarkdownContent } from "../generic/atoms/MarkdownContent";
import { Card } from "../generic/containers/Card";

export const AnnouncementCard: FC<{ announcement: AnnouncementDetails }> = ({ announcement }) => {
    return (
        <Card>
            <View style={styles.margin}>
                <Label type="h3">{announcement.Title}</Label>
                <Label type="caption">
                    {announcement.Area} - {announcement.Author}
                </Label>
            </View>

            <MarkdownContent>{announcement.Content}</MarkdownContent>

            {announcement.Image && <Image source={announcement.Image.Url} style={styles.image} priority="high" />}
        </Card>
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
