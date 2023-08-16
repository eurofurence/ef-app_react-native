import _ from "lodash";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "../../components/Atoms/Icon";
import { Label } from "../../components/Atoms/Label";
import { Card } from "../../components/Containers/Card";
import { Col } from "../../components/Containers/Col";
import { Header } from "../../components/Containers/Header";
import { Row } from "../../components/Containers/Row";
import { NoData } from "../../components/Utilities/NoData";
import { useTheme } from "../../context/Theme";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useGetCommunicationsQuery } from "../../store/eurofurence.service";
import { CommunicationRecord } from "../../store/eurofurence.types";
import { Query } from "../../types";
import { appStyles } from "../AppStyles";

export const PrivateMessageListScreen = () => {
    const { t } = useTranslation("PrivateMessageList");
    const navigation = useAppNavigation("PrivateMessageList");
    const theme = useTheme();
    const { data, refetch, isFetching }: Query<CommunicationRecord[]> = useGetCommunicationsQuery(undefined, {
        refetchOnFocus: true,
    });
    const safe = useSafeAreaInsets();

    const sectionedData = useMemo(() => {
        const [unread, read] = _.partition(data, (it) => it.ReadDateTimeUtc === null);

        const readSections = _.chain(read)
            .orderBy(["AuthorName", "SentDateTimeUtc"], ["asc", "desc"])
            .groupBy((it) => (it.AuthorName ? t("from", { author: it.AuthorName?.trim() }) : t("from_unknown")))
            .map((messages, author) => ({
                title: author,
                data: messages,
            }))
            .value();

        const unreadSections = _.isEmpty(unread)
            ? []
            : [
                  {
                      title: t("unread"),
                      data: unread,
                  },
              ];

        return [...unreadSections, ...readSections];
    }, [data]);

    return (
        <SectionList
            style={[appStyles.abs, safe]}
            sections={sectionedData}
            keyExtractor={(item, index) => item.Id + index}
            stickySectionHeadersEnabled
            onRefresh={refetch}
            refreshing={isFetching}
            ListEmptyComponent={<NoData />}
            ListHeaderComponent={<Header>Private Messages</Header>}
            renderSectionHeader={({ section }) => (
                <Label type={"h2"} style={{ padding: 20, backgroundColor: theme.background }}>
                    {_.startCase(section.title)}
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
                                        status: item.ReadDateTimeUtc === null ? t("unread") : t("read"),
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
