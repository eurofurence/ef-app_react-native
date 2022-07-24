import { FC } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Header } from "../../components/Containers/Header";
import { Row } from "../../components/Containers/Row";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
import { useAppSelector } from "../../store";
import { selectKnowledgeItemsSections } from "../../store/eurofurence.selectors";
import { KnowledgeEntryRecord } from "../../store/eurofurence.types";
import { appStyles } from "../AppStyles";

export const KnowledgeListEntry: FC<{ entry: KnowledgeEntryRecord }> = ({ entry }) => {
    const navigation = useAppNavigation("KnowledgeGroups");
    return (
        <Button style={styles.entryButton} onPress={() => navigation.navigate("KnowledgeEntry", { id: entry.Id })}>
            {entry.Title}
        </Button>
    );
};

export const KnowledgeGroupsScreen = () => {
    const headerStyle = useTopHeaderStyle();
    const entries = useAppSelector((state) => selectKnowledgeItemsSections(state));
    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>Info Articles</Header>
            <SectionList
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
