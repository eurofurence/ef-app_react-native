import { FC } from "react";
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
    const { unread } = useGetCommunicationsQuery(undefined, {
        pollingInterval: 10000,
        selectFromResult: (query) => ({
            ...query,
            unread: query.data?.filter((it) => it.ReadDateTimeUtc === null),
        }),
    });
    return (
        <View style={{ padding: 30 }}>
            <Text style={styles.marginBefore}>
                You have <Text style={{ fontWeight: "bold" }}>{unread?.length}</Text> new messages
            </Text>
            <Button containerStyle={styles.marginBefore} icon="mail-outline" onPress={onOpenMessages}>
                Open messages
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
