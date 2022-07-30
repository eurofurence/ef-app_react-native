import { Image, View } from "react-native";
//@ts-expect-error untyped module
import Markdown from "react-native-easy-markdown";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { knowledgeEntriesSelectors, selectImagesById } from "../../store/eurofurence.selectors";
import { LinkItem } from "../Maps/LinkItem";

export const KnowledgeEntryScreen = () => {
    const { params } = useAppRoute("KnowledgeEntry");
    const entry = useAppSelector((state) => knowledgeEntriesSelectors.selectById(state, params.id));
    const images = useAppSelector((state) => selectImagesById(state, entry?.ImageIds ?? []));
    const safe = useSafeAreaInsets();
    return (
        <ScrollView stickyHeaderIndices={[0]} style={safe} stickyHeaderHiddenOnScroll>
            <Header>{entry?.Title}</Header>
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 }}>
                <Markdown>{entry?.Text ?? ""}</Markdown>
                {entry?.Links.map((link) => (
                    <LinkItem link={link} key={link.Target} />
                ))}
                {images.map((it) => (
                    <Image source={{ uri: it.ImageUrl, height: 400 }} key={it.Id} resizeMode={"contain"} />
                ))}
            </View>
        </ScrollView>
    );
};
