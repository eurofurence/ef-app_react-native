import { FC } from "react";
import { SectionList, StyleSheet, View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Header } from "../../components/Containers/Header";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
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
    const headerStyle = useTopHeaderStyle();
    const entries = useAppSelector((state) => selectKnowledgeItemsSections(state));
    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>Info Articles</Header>
            <SectionList
                onRefresh={synchronizer.synchronize}
                refreshing={synchronizer.isSynchronizing}
                contentContainerStyle={styles.container}
                sections={entries}
                keyExtractor={(item, index) => item.Id + index}
                renderItem={({ item }) => <KnowledgeListEntry entry={item} key={item.Id} />}
                renderSectionHeader={({ section }) => <Section title={section.Name} subtitle={section.Description} />}
            />
        </View>
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
