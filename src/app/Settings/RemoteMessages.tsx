import moment from "moment";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { useAppSelector } from "../../store";

export const RemoteMessages = () => {
    const messages = useAppSelector((state) => state.background.fcmMessages);

    return (
        <View>
            <Section title={"Remote Messages"} subtitle={"Messages that we got from FMC"} icon="message-flash" />

            {messages.length === 0 && <Label mb={15}>We have not received any messages from FCM</Label>}

            {messages.map((message) => (
                <Label mb={15} key={message.dateReceived}>{`${moment(message.dateReceived).format("llll")} - ${JSON.stringify(message.content)}`}</Label>
            ))}
        </View>
    );
};
