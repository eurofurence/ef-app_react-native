import moment from "moment-timezone";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { useAppSelector } from "../../store";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";

export const RemoteMessages = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "remote_messages" });
    const messages = useAppSelector((state) => state.background.fcmMessages);

    return (
        <View>
            <Section title={t("title")} subtitle={t("subtitle")} icon="message-flash" />

            {messages.length === 0 && <Label mb={15}>{t("no_messages")}</Label>}

            {messages.map((message) => (
                <Label mb={15} key={message.dateReceivedUtc}>{`${moment.utc(message.dateReceivedUtc).local().format("llll")} - ${JSON.stringify(message.content)}`}</Label>
            ))}
        </View>
    );
};
