import { FC } from "react";
import { SectionList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Header } from "../../components/Containers/Header";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { selectKnowledgeItemsSections } from "../../store/eurofurence.selectors";
import { KnowledgeEntryRecord } from "../../store/eurofurence.types";

export const KnowledgeListEntry: FC<{ entry: KnowledgeEntryRecord }> = ({ entry }) => {
    const navigation = useAppNavigation("KnowledgeGroups");
    return (
        <Button style={styles.entryButton} onPress={() => navigation.navigate("KnowledgeEntry", { id: entry.Id })}>
            {entry.Title}
        </Button>
    );
};

export const KnowledgeGroupsScreen = () => {
    const synchronizer = useSynchronizer();
    const safe = useSafeAreaInsets();
    const entries = useAppSelector((state) => selectKnowledgeItemsSections(state));

    return (
        <SectionList
            onRefresh={synchronizer.synchronize}
            refreshing={synchronizer.isSynchronizing}
            contentContainerStyle={[styles.container, safe]}
            ListHeaderComponent={<Header style={{ marginHorizontal: -20 }}>Info Articles</Header>}
            sections={entries}
            keyExtractor={(item, index) => item.Id + index}
            renderItem={({ item }) => <KnowledgeListEntry entry={item} key={item.Id} />}
            renderSectionHeader={({ section }) => <Section title={section.Name} subtitle={section.Description} />}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    entryButton: {
        marginVertical: 10,
    },
});
