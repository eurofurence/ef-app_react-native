import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { parseISO, format } from "date-fns";
import { useLocalSearchParams, router } from "expo-router";

import { appStyles } from "@/components/AppStyles";
import { MarkdownContent } from "@/components/generic/atoms/MarkdownContent";
import { Floater } from "@/components/generic/containers/Floater";
import { Header } from "@/components/generic/containers/Header";
import { Label } from "@/components/generic/atoms/Label";
import { Row } from "@/components/generic/containers/Row";
import { Rule } from "@/components/generic/atoms/Rule";
import { useDataCache } from "@/context/DataCacheProvider";
import { CommunicationRecord } from "@/store/eurofurence/types";

const readOpenTimeRequirement = 1500;

export default function PmItem() {
    const { messageId } = useLocalSearchParams<{ messageId: string }>();
    const { t } = useTranslation("PrivateMessageItem");
    const { getAllCacheSync, saveCache } = useDataCache();

    // Get message from cache
    const messages = getAllCacheSync("communications");
    const messageItem = messages.find(item => (item.data as CommunicationRecord).Id === messageId);
    const message = messageItem?.data as CommunicationRecord | undefined;

    // Mark as read after delay
    useEffect(() => {
        if (!message || message.ReadDateTimeUtc !== null) return;

        const handle = setTimeout(() => {
            console.debug("marking as read", message.ReadDateTimeUtc);
            const updatedMessage: CommunicationRecord = {
                ...message,
                ReadDateTimeUtc: new Date().toISOString()
            };
            saveCache("communications", message.Id, updatedMessage);
        }, readOpenTimeRequirement);

        return () => clearTimeout(handle);
    }, [message, saveCache]);

    // Navigate back if message not found
    useEffect(() => {
        if (!message) {
            router.back();
        }
    }, [message]);

    if (!message) return null;

    const formattedDate = message.ReceivedDateTimeUtc ? format(parseISO(message.ReceivedDateTimeUtc), 'PPpp') : '';

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("header")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <Label type="h1" mt={30} mb={10}>
                    {message.Subject}
                </Label>

                <Row style={styles.byline} variant="spaced">
                    <Label>
                        <Label>{formattedDate}</Label>
                    </Label>

                    <Label style={styles.tag} ellipsizeMode="head" numberOfLines={1}>
                        {t("from", { authorName: message.AuthorName })}
                    </Label>
                </Row>
                <Rule style={styles.rule} />

                <MarkdownContent>{message.Message}</MarkdownContent>
            </Floater>
        </ScrollView>
    );
}

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