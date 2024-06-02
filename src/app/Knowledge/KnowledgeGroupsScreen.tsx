import { ListRenderItemInfo } from "@react-native/virtualized-lists/Lists/VirtualizedList";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet, View } from "react-native";
import { SectionListData } from "react-native/Libraries/Lists/SectionList";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/app/AppStyles";
import { useSynchronizer } from "../../components/app/sync/SynchronizationProvider";
import { Label } from "../../components/generic/atoms/Label";
import { Section } from "../../components/generic/atoms/Section";
import { Card } from "../../components/generic/containers/Card";
import { Header } from "../../components/generic/containers/Header";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { useAppSelector } from "../../store";
import { selectKnowledgeItemsSections } from "../../store/eurofurence.selectors";
import { KnowledgeEntryRecord } from "../../store/eurofurence.types";

export const KnowledgeListEntry: FC<{ entry: KnowledgeEntryRecord }> = ({ entry }) => {
    const navigation = useAppNavigation("KnowledgeGroups");

    return (
        <View style={{ paddingHorizontal: 20 }}>
            <Card style={styles.card} onPress={() => navigation.navigate("KnowledgeEntry", { id: entry.Id })}>
                <Label>{entry.Title}</Label>
            </Card>
        </View>
    );
};

export const KnowledgeGroupsScreen = () => {
    const { t } = useTranslation("KnowledgeGroups");
    const synchronizer = useSynchronizer();
    const safe = useSafeAreaInsets();
    const entries = useAppSelector((state) => selectKnowledgeItemsSections(state));

    const sectionStyle = useThemeBackground("surface");

    const headerComponent = useMemo(() => <Header>{t("header")}</Header>, [t]);

    const keyExtractor = useCallback(({ Id }: KnowledgeEntryRecord, index: number) => Id + index, []);
    const renderSection = useCallback(
        ({ section }: SectionListData<any, any>) => {
            return <Section title={section.Name} subtitle={section.Description} style={[styles.section, sectionStyle]} />;
        },
        [sectionStyle],
    );
    const renderItem = useCallback(({ item }: ListRenderItemInfo<KnowledgeEntryRecord>) => {
        return <KnowledgeListEntry entry={item} key={item.Id} />;
    }, []);
    const renderSectionFooter = useCallback(() => {
        return <View style={styles.footer} />;
    }, []);

    return (
        <SectionList
            style={[appStyles.abs, safe]}
            onRefresh={synchronizer.synchronize}
            refreshing={synchronizer.isSynchronizing}
            ListHeaderComponent={headerComponent}
            sections={entries}
            stickySectionHeadersEnabled
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderSectionHeader={renderSection}
            renderSectionFooter={renderSectionFooter}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        minHeight: 0,
        marginVertical: 4,
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    footer: {
        height: 20,
    },
    entryButton: {
        marginVertical: 10,
    },
    section: {
        padding: 20,
        marginTop: 0,
    },
});
