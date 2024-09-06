import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { MarkdownContent } from "../../components/generic/atoms/MarkdownContent";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppNavigation, useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useGetCommunicationsQuery, useMarkCommunicationReadMutation } from "../../store/eurofurence/service";
import { CommunicationRecord, RecordId } from "../../store/eurofurence/types";

const readOpenTimeRequirement = 3_000;
export type PmItemParams = {
    id: RecordId;
    message?: CommunicationRecord;
};
export const PmItem = () => {
    // Use base params.
    const navigation = useAppNavigation("PrivateMessageItem");
    const { params } = useAppRoute("PrivateMessageItem");

    // Use API connection.
    const [markRead] = useMarkCommunicationReadMutation();
    const { remoteMessage, ready } = useGetCommunicationsQuery(undefined, {
        // Skip if already got the message.
        skip: Boolean(params.message),
        selectFromResult: (result) => ({
            remoteMessage: result.data?.find((item) => item.Id === params.id),
            ready: result.isSuccess || result.isError,
        }),
    });

    // Get message from params or from the given item.
    const message = params.message ?? remoteMessage;

    // Connect opening to reading.
    useEffect(() => {
        if (!message) return;
        if (message.ReadDateTimeUtc !== null) return;

        const handle = setTimeout(() => {
            console.debug("marking as read", message.ReadDateTimeUtc);
            markRead(message.Id);
        }, readOpenTimeRequirement);

        return () => clearTimeout(handle);
    }, [message, markRead]);

    // If no message currently displayable, check if fetching. If not fetching
    useEffect(() => {
        if (ready && !message) {
            navigation.pop();
        }
    }, [message, ready, navigation]);

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{!message ? "Viewing message" : message.Subject}</Header>
            <Floater contentStyle={appStyles.trailer}>{!message ? null : <MarkdownContent>{message.Message}</MarkdownContent>}</Floater>
        </ScrollView>
    );
};
