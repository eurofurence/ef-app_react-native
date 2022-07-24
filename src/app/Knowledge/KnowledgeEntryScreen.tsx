import { StyleSheet, Text, View } from "react-native";

import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
import { useAppSelector } from "../../store";
import { knowledgeEntriesSelectors } from "../../store/eurofurence.selectors";

export const KnowledgeEntryScreen = () => {
    const { params } = useAppRoute("KnowledgeEntry");
    const entry = useAppSelector((state) => knowledgeEntriesSelectors.selectById(state, params.id));
    const headerStyle = useTopHeaderStyle();
    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{entry?.Title}</Header>

            <Text style={styles.text}>{entry?.Text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        padding: 16,
    },
});
