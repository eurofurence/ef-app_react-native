import moment from "moment";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { useAppSelector } from "../../store";

export const RemoteMessages = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "remote_messages" });
    const messages = useAppSelector((state) => state.background.fcmMessages);

    return (
        <View>
            <Section title={t("title")} subtitle={t("subtitle")} icon="message-flash" />

            {messages.length === 0 && <Label mb={15}>{t("no_messages")}</Label>}

            {messages.map((message) => (
                <Label mb={15} key={message.dateReceived}>{`${moment(message.dateReceived).format("llll")} - ${JSON.stringify(message.content)}`}</Label>
            ))}
        </View>
    );
};
