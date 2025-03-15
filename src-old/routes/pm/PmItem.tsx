import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useTranslation } from "react-i18next";
import moment from "moment-timezone";
import { appStyles } from "../../components/AppStyles";
import { MarkdownContent } from "../../components/generic/atoms/MarkdownContent";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppNavigation, useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useGetCommunicationsQuery, useMarkCommunicationReadMutation } from "../../store/eurofurence/service";
import { CommunicationRecord, RecordId } from "../../store/eurofurence/types";
import { Label } from "../../components/generic/atoms/Label";
import { Row } from "../../components/generic/containers/Row";
import { Rule } from "../../components/generic/atoms/Rule";

const readOpenTimeRequirement = 1_500;
export type PmItemParams = {
    id: RecordId;
    message?: CommunicationRecord;
};
export const PmItem = () => {
    // Use base params.
    const navigation = useAppNavigation("PrivateMessageItem");
    const { params } = useAppRoute("PrivateMessageItem");
    const { t } = useTranslation("PrivateMessageItem");

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
            <Header>{t("header")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                {!message ? null : (
                    <>
                        <Label type="h1" mt={30} mb={10}>
                            {message.Subject}
                        </Label>

                        <Row style={styles.byline} variant="spaced">
                            <Label>
                                <Label>{moment.utc(message.ReceivedDateTimeUtc).local().format("lll")}</Label>
                            </Label>

                            <Label style={styles.tag} ellipsizeMode="head" numberOfLines={1}>
                                {t("from", { authorName: message.AuthorName })}
                            </Label>
                        </Row>
                        <Rule style={styles.rule} />

                        <MarkdownContent>{message.Message}</MarkdownContent>
                    </>
                )}
            </Floater>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    byline: {
        marginTop: 10,
    },
    rule: {
        marginTop: 10,
        marginBottom: 30,
    },
    tag: {
        textAlign: "right",
    },
    posterLine: {
        marginBottom: 20,
        alignItems: "center",
    },
});
