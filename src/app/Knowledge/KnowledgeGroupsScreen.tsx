import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Label } from "../../components/Atoms/Label";

import { Section } from "../../components/Atoms/Section";
import { Card } from "../../components/Containers/Card";
import { Header } from "../../components/Containers/Header";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useTheme } from "../../context/Theme";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { selectKnowledgeItemsSections } from "../../store/eurofurence.selectors";
import { KnowledgeEntryRecord } from "../../store/eurofurence.types";

import { appStyles } from "../AppStyles";

export const KnowledgeListEntry: FC<{ entry: KnowledgeEntryRecord }> = ({ entry }) => {
    const navigation = useAppNavigation("KnowledgeGroups");

    return (
        <View style={{ paddingHorizontal: 20 }}>
            <Card
                style={styles.card}
                onPress={() => navigation.navigate("KnowledgeEntry", { id: entry.Id })}
            >
                <Label>{entry.Title}</Label>
            </Card>
        </View>
    );
};

export const KnowledgeGroupsScreen = () => {
    const { t } = useTranslation("KnowledgeGroups");
    const synchronizer = useSynchronizer();
    const safe = useSafeAreaInsets();
    const theme = useTheme();
    const entries = useAppSelector((state) => selectKnowledgeItemsSections(state));

    return (
        <SectionList
            style={[appStyles.abs, safe]}
            onRefresh={synchronizer.synchronize}
            refreshing={synchronizer.isSynchronizing}
            ListHeaderComponent={<Header>{t("header")}</Header>}
            sections={entries}
            stickySectionHeadersEnabled
            keyExtractor={(item, index) => item.Id + index}
            renderItem={({ item }) => <KnowledgeListEntry entry={item} key={item.Id} />}
            renderSectionHeader={({ section }) => <Section title={section.Name} subtitle={section.Description} style={{ padding: 20, marginTop: 0, backgroundColor: theme.background }} />}
            renderSectionFooter={() => <View style={styles.footer} />}
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
});