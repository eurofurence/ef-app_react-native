import { FC } from "react";
import { Image, View } from "react-native";
//@ts-expect-error untyped module
import Markdown from "react-native-easy-markdown";

import { Label } from "../../components/Atoms/Label";
import { Card } from "../../components/Containers/Card";
import { EnrichedAnnouncementRecord } from "../../store/eurofurence.types";

export const AnnouncementItem: FC<{ announcement: EnrichedAnnouncementRecord }> = ({ announcement }) => {
    return (
        <Card>
            <View style={{ marginBottom: 5 }}>
                <Label type={"h3"}>{announcement.Title}</Label>
                <Label type={"caption"}>
                    {announcement.Area} - {announcement.Author}
                </Label>
            </View>

            <Markdown>{announcement.Content}</Markdown>

            {announcement.ImageUrl && <Image source={{ uri: announcement.ImageUrl }} style={{ width: "100%", height: "auto" }} />}
        </Card>
    );
};
