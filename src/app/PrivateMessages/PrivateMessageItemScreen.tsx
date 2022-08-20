import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MarkdownContent } from "../../components/Atoms/MarkdownContent";
import { Floater } from "../../components/Containers/Floater";
import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useMarkCommunicationReadMutation } from "../../store/eurofurence.service";
import { appStyles } from "../AppStyles";

export const PrivateMessageItemScreen = () => {
    const { params } = useAppRoute("PrivateMessageItem");
    const safe = useSafeAreaInsets();
    const [markRead] = useMarkCommunicationReadMutation();

    useEffect(() => {
        if (params.message.ReadDateTimeUtc === null) {
            console.debug("marking as read", params.message.ReadDateTimeUtc);
            markRead(params.id);
        }
    }, [params.message]);

    return (
        <ScrollView style={[safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{params.message.Subject}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <MarkdownContent>{params.message.Message}</MarkdownContent>
            </Floater>
        </ScrollView>
    );
};
