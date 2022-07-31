import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Floater } from "../../components/Containers/Floater";
import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useMarkCommunicationReadMutation } from "../../store/eurofurence.service";
import { appStyles } from "../AppStyles";

export const PrivateMessageItemScreen = () => {
    const { params } = useAppRoute("PrivateMessageItem");
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
            <Floater contentStyle={appStyles.trailer}>
                <Text>{params.message.Message}</Text>
            </Floater>
        </View>
    );
};
