import { StyleSheet, View, Image } from "react-native";
import Markdown from "react-native-easy-markdown";

import { ImageEx } from "../../components/Atoms/ImageEx";
import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
import { useAppSelector } from "../../store";
import { knowledgeEntriesSelectors, selectImagesById } from "../../store/eurofurence.selectors";
import { LinkItem } from "../Maps/LinkItem";

export const KnowledgeEntryScreen = () => {
    const { params } = useAppRoute("KnowledgeEntry");
    const entry = useAppSelector((state) => knowledgeEntriesSelectors.selectById(state, params.id));
    const images = useAppSelector((state) => selectImagesById(state, entry?.ImageIds ?? []));
    const headerStyle = useTopHeaderStyle();
    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{entry?.Title}</Header>
            <Scroller>
                <Markdown>{entry?.Text ?? ""}</Markdown>
                {entry?.Links.map((link) => (
                    <LinkItem link={link} key={link.Target} />
                ))}
                {images.map((it) => (
                    <Image source={{ uri: it.ImageUrl, height: 400 }} key={it.Id} resizeMode={"contain"} />
                ))}
            </Scroller>
        </View>
    );
};
