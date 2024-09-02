import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { Banner } from "../../components/generic/atoms/Banner";
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
                {images.map((image, i) => (
                    <View key={i} style={styles.posterLine}>
                        <Banner image={image} viewable />
                    </View>
                ))}
                <MarkdownContent>{entry?.Text ?? ""}</MarkdownContent>
                {entry?.Links.map((link) => (
                    <View style={{ marginBottom: 10 }} key={link.Target}>
                        <LinkItem link={link} key={link.Target} />
                    </View>
                ))}
            </Floater>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    posterLine: {
        marginBottom: 20,
        alignItems: "center",
    },
});
