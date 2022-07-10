import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";
import moment from "moment";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../../components/Atoms/Label";
import { Col } from "../../components/Containers/Col";
import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useGetCommunicationsQuery } from "../../store/eurofurence.service";
import { CommunicationRecord } from "../../store/eurofurence.types";

export const PrivateMessageListScreen = () => {
    const navigation = useNavigation();
    const { data }: Query<CommunicationRecord[]> = useGetCommunicationsQuery(undefined, {
        pollingInterval: 1000,
    });

    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);

    return (
        <View>
            <Header style={headerStyle}>Private Messages</Header>
            <Scroller>
                {data?.map((message) => (
                    <TouchableOpacity
                        style={styles.container}
                        key={message.Id}
                        onPress={() =>
                            // @ts-expect-error nav typing
                            navigation.navigate("PrivateMessageItem", {
                                id: message.Id,
                                message,
                            })
                        }
                    >
                        <Col style={styles.title}>
                            <Label type={"h4"}>{message.Subject}</Label>
                            <Label>
                                {message.ReadDateTimeUtc === null ? "Unread" : "Read"} - Sent on {moment(message.CreatedDateTimeUtc).format("llll")}
                            </Label>
                        </Col>
                        <Ionicons name={"arrow-forward"} />
                    </TouchableOpacity>
                ))}
            </Scroller>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "baseline",
        marginVertical: 15,
    },
    title: {
        flex: 6,
    },
    action: {
        flex: 3,
    },
});
