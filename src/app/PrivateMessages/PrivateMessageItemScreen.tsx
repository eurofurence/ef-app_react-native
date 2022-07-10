import { useRoute } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useMarkCommunicationReadMutation } from "../../store/eurofurence.service";
import { CommunicationRecord, RecordId } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";

export type PrivateMessageItemParams = {
    id: RecordId;
    message: CommunicationRecord;
};

export type PrivateMessageItemProps = StackScreenProps<ScreenStartNavigatorParamsList, "PrivateMessageItem">;

export const PrivateMessageItemScreen: FC<PrivateMessageItemProps> = ({ route }) => {
    const params = route.params;
    const [markRead] = useMarkCommunicationReadMutation();
    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);

    useEffect(() => {
        if (params.message.ReadDateTimeUtc === null) {
            console.debug("marking as read", params.message.ReadDateTimeUtc);
            markRead(params.id);
        }
    }, [params.message]);

    return (
        <View>
            <Header style={headerStyle}>{params.message.Subject}</Header>
            <Scroller>
                <Text>{params.message.Message}</Text>
            </Scroller>
        </View>
    );
};
