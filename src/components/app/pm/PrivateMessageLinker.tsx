import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useGetCommunicationsQuery } from "../../../store/eurofurence.service";
import { Label } from "../../generic/atoms/Label";
import { Button } from "../../generic/containers/Button";

type PrivateMessageLinkerProps = {
    open?: boolean;
    onOpenMessages?: () => void;
};

/**
 * Creates a link to the private messages screen
 * @constructor
 */
export const PrivateMessageLinker: FC<PrivateMessageLinkerProps> = ({ onOpenMessages, open }) => {
    const prevOpen = useRef(open);
    const { t } = useTranslation("Menu");
    const { unread, refetch } = useGetCommunicationsQuery(undefined, {
        selectFromResult: (query) => ({
            ...query,
            unread: query.data?.filter((it) => it.ReadDateTimeUtc === null),
        }),
    });

    useEffect(() => {
        if (open === true && prevOpen.current !== open) {
            console.debug("Fetching new private messages");
            refetch();
        }
        prevOpen.current = open;
        console.debug("Tab open has changed status", open);
    }, [open]);

    return (
        <View style={{ padding: 30 }}>
            <Label variant={unread?.length ? "bold" : undefined}>{t("messages", { count: unread?.length ?? 0 })}</Label>
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
