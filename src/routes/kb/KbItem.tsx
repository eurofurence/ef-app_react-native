import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { MarkdownContent } from "../../components/generic/atoms/MarkdownContent";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { LinkItem } from "../../components/maps/LinkItem";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { selectImagesById } from "../../store/eurofurence/selectors/images";
import { knowledgeEntriesSelectors } from "../../store/eurofurence/selectors/records";

export const KbItem = () => {
    const { params } = useAppRoute("KnowledgeEntry");
    const entry = useAppSelector((state) => knowledgeEntriesSelectors.selectById(state, params.id));
    const images = useAppSelector((state) => selectImagesById(state, entry?.ImageIds ?? []));
    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{entry?.Title}</Header>
            <Floater contentStyle={appStyles.trailer}>
                {images.map((it) => (
                    <Image style={styles.image} source={it.FullUrl} key={it.Id} contentFit="contain" />
                ))}
                <MarkdownContent>{entry?.Text ?? ""}</MarkdownContent>
                {entry?.Links.map((link) => (
                    <View style={{ marginBottom: 10 }}>
                        <LinkItem link={link} key={link.Target} />
                    </View>
                ))}
            </Floater>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "auto",
        aspectRatio: 4 / 3,
    },
});
