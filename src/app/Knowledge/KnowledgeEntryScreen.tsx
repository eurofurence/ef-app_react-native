import { StyleSheet, View } from "react-native";
import MarkdownView from "react-native-showdown";

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
            <View style={{ flex: 1, margin: 16 }}>
                <MarkdownView markdown={entry?.Text ?? ""} />
            </View>
        </View>
    );
};
