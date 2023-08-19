import { Image } from "expo-image";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { MarkdownContent } from "../../components/Atoms/MarkdownContent";
import { Card } from "../../components/Containers/Card";
import { AnnouncementDetails } from "../../store/eurofurence.types";

export const AnnouncementItem: FC<{ announcement: AnnouncementDetails }> = ({ announcement }) => {
    return (
        <Card>
            <View style={{ marginBottom: 5 }}>
                <Label type={"h3"}>{announcement.Title}</Label>
                <Label type={"caption"}>
                    {announcement.Area} - {announcement.Author}
                </Label>
            </View>

            <MarkdownContent>{announcement.Content}</MarkdownContent>

            {announcement.Image && <Image source={{ uri: announcement.Image.FullUrl }} style={styles.image} />}
        </Card>
    );
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "auto",
    },
});
