import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, ViewStyle } from "react-native";

import { Claims } from "../../context/AuthContext";
import { useGetCommunicationsQuery } from "../../store/eurofurence.service";
import { Button } from "../generic/containers/Button";

type PrivateMessageLinkerProps = {
    containerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    user: Claims | null;
    open?: boolean;
    onOpenMessages?: () => void;
};

/**
 * Creates a link to the private messages screen
 * @constructor
 */
export const PrivateMessageLinker: FC<PrivateMessageLinkerProps> = ({ containerStyle, style, user, onOpenMessages, open }) => {
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
    }, [open]);

    // TODO: New style??
    return (
        <Button
            containerStyle={containerStyle}
            style={style}
            outline={!unread?.length}
            iconRight={unread?.length ? "email-multiple-outline" : "email-open-multiple-outline"}
            onPress={onOpenMessages}
        >
            {unread?.length ? t("messages", { count: unread?.length ?? 0, name: user?.name }) : t("open_messages", { name: user?.name })}
        </Button>
    );
};
