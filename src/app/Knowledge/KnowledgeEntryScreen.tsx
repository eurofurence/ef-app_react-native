import { StyleSheet, View } from "react-native";
import Markdown from "react-native-easy-markdown";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
import { useAppSelector } from "../../store";
import { knowledgeEntriesSelectors } from "../../store/eurofurence.selectors";
import { LinkItem } from "../Maps/LinkItem";

export const KnowledgeEntryScreen = () => {
    const { params } = useAppRoute("KnowledgeEntry");
    const entry = useAppSelector((state) => knowledgeEntriesSelectors.selectById(state, params.id));
    const headerStyle = useTopHeaderStyle();
    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{entry?.Title}</Header>
            <Scroller>
                <Markdown>{entry?.Text ?? ""}</Markdown>
                {entry?.Links?.map((link) => (
                    <LinkItem link={link} key={link.Target} />
                ))}
                {entry.Ima}
            </Scroller>
        </View>
    );
};
