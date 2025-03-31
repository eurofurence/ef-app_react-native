import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet } from "react-native";
import { chain, partition, isEmpty, startCase } from "lodash";
import { router } from "expo-router";

import { Label } from "@/components/generic/atoms/Label";
import { Header } from "@/components/generic/containers/Header";
import { PrivateMessageCard } from "@/components/messages/PrivateMessageCard";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";
import { useDataCache } from "@/context/DataCacheProvider";
import { CommunicationRecord } from "@/store/eurofurence/types";
import { NoData } from "@/components/generic/containers/NoData";

type Section = {
    title: string;
    data: CommunicationRecord[];
};

export default function PmList() {
    const { t } = useTranslation("PrivateMessageList");
    const { getAllCacheSync, isSynchronizing, synchronizeUi } = useDataCache();
    const messages = getAllCacheSync("communications");
    const data = messages.map(item => item.data as CommunicationRecord);

    const navigateTo = useCallback(
        (item: CommunicationRecord) =>
            router.push({
                pathname: "/messages/[messageId]",
                params: { messageId: item.Id }
            }),
        []
    );

    const sectionedData = useMemo(() => {
        const [unread, read] = partition(data, (it: CommunicationRecord) => it.ReadDateTimeUtc === null);

        const readSections = chain(read)
            .orderBy(["AuthorName", "SentDateTimeUtc"], ["asc", "desc"])
            .groupBy((it: CommunicationRecord) => (it.AuthorName ? t("from", { author: it.AuthorName?.trim() }) : t("from_unknown")))
            .map((messages, author) => ({
                title: author,
                data: messages,
            }))
            .value();

        const unreadSections = isEmpty(unread)
            ? []
            : [
                  {
                      title: t("unread"),
                      data: unread,
                  },
              ];

        return [...unreadSections, ...readSections] as Section[];
    }, [data, t]);

    const sectionStyle = useThemeBackground("background");

    const keyExtractor = useCallback(({ Id }: CommunicationRecord, index: number) => Id + index, []);
    const emptyComponent = useMemo(() => <NoData text={t("no_data")} />, [t]);
    const headerComponent = useMemo(() => <Header>{t("header")}</Header>, []);

    const renderSection = useCallback(
        ({ section }: { section: Section }) => (
            <Label type="h2" style={[styles.section, sectionStyle]}>
                {startCase(section.title)}
            </Label>
        ),
        [sectionStyle]
    );

    const renderItem = useCallback(
        ({ item }: { item: CommunicationRecord }) => (
            <PrivateMessageCard
                key={item.Id}
                containerStyle={styles.item}
                onPress={() => navigateTo(item)}
                item={item}
            />
        ),
        [navigateTo]
    );

    const backgroundStyle = useThemeBackground("background");

    return (
        <SectionList<CommunicationRecord, Section>
            style={[StyleSheet.absoluteFill, backgroundStyle]}
            sections={sectionedData}
            contentContainerStyle={styles.container}
            keyExtractor={keyExtractor}
            stickySectionHeadersEnabled
            onRefresh={synchronizeUi}
            refreshing={isSynchronizing}
            ListEmptyComponent={emptyComponent}
            ListHeaderComponent={headerComponent}
            renderSectionHeader={renderSection}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 20
    },
    action: {
        flex: 3,
    },
    item: {
        paddingHorizontal: 20,
    },
    container: {
        paddingBottom: 100,
    },
});
