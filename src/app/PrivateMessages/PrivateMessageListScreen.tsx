import { ListRenderItemInfo } from "@react-native/virtualized-lists/Lists/VirtualizedList";
import _ from "lodash";
import moment from "moment";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet, View } from "react-native";
import { SectionListData } from "react-native/Libraries/Lists/SectionList";
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

type PrivateMessageItemProps = {
    onPress: (item: CommunicationRecord) => void;
    item: CommunicationRecord;
};

const PrivateMessageItem: FC<PrivateMessageItemProps> = ({ item, onPress }) => {
    const { t } = useTranslation("PrivateMessageList");
    const onPressDelegate = useCallback(() => onPress(item), [onPress, item]);

    return (
        <View style={styles.itemPadding}>
            <Card onPress={onPressDelegate}>
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
                    <View style={styles.itemChevron}>
                        <Icon name="chevron-right" size={30} />
                    </View>
                </Row>
            </Card>
        </View>
    );
};

export const PrivateMessageListScreen = () => {
    const { t } = useTranslation("PrivateMessageList");
    const navigation = useAppNavigation("PrivateMessageList");
    const theme = useTheme();
    const { data, refetch, isFetching }: Query<CommunicationRecord[]> = useGetCommunicationsQuery(undefined, {
        refetchOnFocus: true,
    });
    const safe = useSafeAreaInsets();

    const navigateTo = useCallback(
        (item: CommunicationRecord) =>
            navigation.navigate("PrivateMessageItem", {
                id: item.Id,
                message: item,
            }),
        [navigation],
    );
    const onPress = useCallback((item: CommunicationRecord) => navigateTo(item), [navigateTo]);

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

    const sectionStyle = useMemo(() => ({ backgroundColor: theme.background }), [theme]);

    const keyExtractor = useCallback(({ Id }: CommunicationRecord, index: number) => Id + index, []);
    const emptyComponent = useMemo(() => <NoData />, []);
    const headerComponent = useMemo(() => <Header>Private Messages</Header>, []);
    const renderSection = useCallback(
        ({ section }: SectionListData<any, any>) => {
            return (
                <Label type={"h2"} style={[styles.section, sectionStyle]}>
                    {_.startCase(section.title)}
                </Label>
            );
        },
        [sectionStyle],
    );
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<CommunicationRecord>) => {
            return <PrivateMessageItem key={item.Id} onPress={onPress} item={item} />;
        },
        [onPress],
    );
    return (
        <SectionList
            style={[appStyles.abs, safe]}
            sections={sectionedData}
            keyExtractor={keyExtractor}
            stickySectionHeadersEnabled
            onRefresh={refetch}
            refreshing={isFetching}
            ListEmptyComponent={emptyComponent}
            ListHeaderComponent={headerComponent}
            renderSectionHeader={renderSection}
            renderItem={renderItem}
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
    section: { padding: 20 },
    title: {
        flex: 6,
    },
    action: {
        flex: 3,
    },
    itemPadding: {
        paddingHorizontal: 20,
    },
    itemChevron: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 50,
    },
});
