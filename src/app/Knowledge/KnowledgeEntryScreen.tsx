import { Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MarkdownContent } from "../../components/Atoms/MarkdownContent";
import { Floater } from "../../components/Containers/Floater";
import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { knowledgeEntriesSelectors, selectImagesById } from "../../store/eurofurence.selectors";
import { appStyles } from "../AppStyles";
import { LinkItem } from "../Maps/LinkItem";

export const KnowledgeEntryScreen = () => {
    const { params } = useAppRoute("KnowledgeEntry");
    const entry = useAppSelector((state) => knowledgeEntriesSelectors.selectById(state, params.id));
    const images = useAppSelector((state) => selectImagesById(state, entry?.ImageIds ?? []));
    const safe = useSafeAreaInsets();
    return (
        <ScrollView style={[appStyles.abs, safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{entry?.Title}</Header>
            <Floater contentStyle={appStyles.trailer}>
                {images.map((it) => (
                    <Image source={{ uri: it.FullUrl, height: 400 }} key={it.Id} resizeMode={"contain"} />
                ))}
                <MarkdownContent>{entry?.Text ?? ""}</MarkdownContent>
                {entry?.Links.map((link) => (
                    <LinkItem link={link} key={link.Target} />
                ))}
            </Floater>
        </ScrollView>
    );
};
