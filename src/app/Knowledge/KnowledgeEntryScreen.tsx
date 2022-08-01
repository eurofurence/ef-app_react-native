import { Image } from "react-native";
//@ts-expect-error untyped module
import Markdown from "react-native-easy-markdown";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
                <Markdown>{entry?.Text ?? ""}</Markdown>
                {entry?.Links.map((link) => (
                    <LinkItem link={link} key={link.Target} />
                ))}
                {images.map((it) => (
                    <Image source={{ uri: it.ImageUrl, height: 400 }} key={it.Id} resizeMode={"contain"} />
                ))}
            </Floater>
        </ScrollView>
    );
};
