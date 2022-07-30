import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import _ from "lodash";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../../components/Atoms/Label";
import { Card } from "../../components/Containers/Card";
import { Col } from "../../components/Containers/Col";
import { Header } from "../../components/Containers/Header";
import { Row } from "../../components/Containers/Row";
import { useTheme } from "../../context/Theme";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useGetCommunicationsQuery } from "../../store/eurofurence.service";
import { CommunicationRecord } from "../../store/eurofurence.types";
import { Query } from "../../types";

export const PrivateMessageListScreen = () => {
    const { t } = useTranslation("PrivateMessageList");
    const navigation = useAppNavigation("PrivateMessageList");
    const theme = useTheme();
    const { data, refetch, isFetching }: Query<CommunicationRecord[]> = useGetCommunicationsQuery(undefined, {
        refetchOnFocus: true,
    });
    const inserts = useSafeAreaInsets();

    const sectionedData = useMemo(
        () =>
            _.chain(data)
                .orderBy((it) => it.ReadDateTimeUtc, "desc")
                .groupBy((it) => it.AuthorName)
                .map((messages, author) => ({
                    title: author.trim(),
                    data: messages,
                }))
                .value(),
        [data]
    );

    return (
        <SectionList
            style={[inserts]}
            sections={sectionedData}
            keyExtractor={(item, index) => item.Id + index}
            stickySectionHeadersEnabled
            onRefresh={refetch}
            refreshing={isFetching}
            ListHeaderComponent={<Header>Private Messages</Header>}
            renderSectionHeader={({ section }) => (
                <Label type={"h2"} style={{ padding: 20, backgroundColor: theme.background }}>
                    {t("section_title_from", { authorName: _.capitalize(section.title) })}
                </Label>
            )}
            renderItem={({ item }) => (
                <View style={{ paddingHorizontal: 20 }}>
                    <Card
                        key={item.Id}
                        onPress={() =>
                            navigation.navigate("PrivateMessageItem", {
                                id: item.Id,
                                message: item,
                            })
                        }
                    >
                        <Row>
                            <Col style={styles.title}>
                                <Label variant={item.ReadDateTimeUtc === null ? "bold" : "regular"}>{item.Subject}</Label>
                                <Label variant={item.ReadDateTimeUtc === null ? "bold" : "regular"}>
                                    {t("message_item_subtitle", {
                                        status: item.ReadDateTimeUtc === null ? "Unread" : "Read",
                                        time: moment(item.CreatedDateTimeUtc).format("llll"),
                                    })}
                                </Label>
                            </Col>
                            <View
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: 50,
                                    height: 50,
                                    borderRadius: 50,
                                }}
                            >
                                <Icon name="chevron-right" size={30} />
                            </View>
                        </Row>
                    </Card>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "baseline",
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    title: {
        flex: 6,
    },
    action: {
        flex: 3,
    },
});
