import { RouteProp, useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppRoute } from "../../hooks/useAppRoute";
import { useMarkCommunicationReadMutation } from "../../store/eurofurence.service";
import { CommunicationRecord, RecordId } from "../../store/eurofurence.types";
import { ScreenStartParamsList } from "../ScreenStart";

export type PrivateMessageItemParams = {
    id: RecordId;
    message: CommunicationRecord;
};

export type PrivateMessageItemProps = StackScreenProps<ScreenStartParamsList, "PrivateMessageItem">;

export const PrivateMessageItemScreen: FC<PrivateMessageItemProps> = () => {
    const { params } = useRoute<CustomRoute<PrivateMessageItemParams, "PrivateMessageItem">>();
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
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{params.message.Subject}</Header>
            <Scroller>
                <Text>{params.message.Message}</Text>
            </Scroller>
        </View>
    );
};
