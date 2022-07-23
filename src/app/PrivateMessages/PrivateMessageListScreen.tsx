import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/core";
import moment from "moment";
import React, { useMemo } from "react";
import { RefreshControl, StyleSheet, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../../components/Atoms/Label";
import { Col } from "../../components/Containers/Col";
import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useGetCommunicationsQuery } from "../../store/eurofurence.service";
import { CommunicationRecord } from "../../store/eurofurence.types";
import { ScreenStartParamsList } from "../ScreenStart";

export const PrivateMessageListScreen = () => {
    const navigation = useAppNavigation("PrivateMessageList");
    const { data, refetch, isFetching }: Query<CommunicationRecord[]> = useGetCommunicationsQuery(undefined, {
        // TODO: We need to react to FCM PM notifications.
        // pollingInterval: 10000,
        refetchOnFocus: true,
    });

    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>Private Messages</Header>
            <Scroller refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
                {data?.map((message) => (
                    <TouchableOpacity
                        style={styles.container}
                        key={message.Id}
                        onPress={() =>
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
                        <Icon name="chevron-right" />
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
