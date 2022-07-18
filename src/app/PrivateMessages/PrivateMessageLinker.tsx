import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { useGetCommunicationsQuery } from "../../store/eurofurence.service";

type PrivateMessageLinkerProps = {
    onOpenMessages?: () => void;
};

/**
 * Creates a link to the private messages screen
 * @constructor
 */
export const PrivateMessageLinker: FC<PrivateMessageLinkerProps> = ({ onOpenMessages }) => {
    const { t } = useTranslation("Menu");
    const { unread } = useGetCommunicationsQuery(undefined, {
        // TODO: We need to react to FCM PM notifications.
        // pollingInterval: 10000,
        refetchOnFocus: true,
        selectFromResult: (query) => ({
            ...query,
            unread: query.data?.filter((it) => it.ReadDateTimeUtc === null),
        }),
    });
    return (
        <View style={{ padding: 30 }}>
            <Text style={styles.marginBefore}>{t("messages", { count: unread?.length ?? 0 })}</Text>
            <Button style={styles.marginBefore} icon={unread?.length ? "email-multiple-outline" : "email-open-multiple-outline"} onPress={onOpenMessages}>
                {t("open_messages")}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    marginAfter: {
        marginBottom: 16,
    },
    marginBefore: {
        marginTop: 16,
    },
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
});
