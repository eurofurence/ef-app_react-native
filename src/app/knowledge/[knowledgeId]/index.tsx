import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Banner } from "@/components/generic/atoms/Banner";
import { MarkdownContent } from "@/components/generic/atoms/MarkdownContent";
import { Floater } from "@/components/generic/containers/Floater";
import { LinkItem } from "@/components/maps/LinkItem";
import { useDataCache } from "@/context/DataCacheProvider";
import { LinkFragment } from "@/store/eurofurence/types";

export default function KnowledgeId() {
    const { knowledgeId } = useLocalSearchParams();
    const { getCacheSync, getAllCacheSync } = useDataCache();

    // Get the knowledge entry from cache
    const entry = getCacheSync("knowledgeEntries", knowledgeId as string)?.data;
    
    // Get all images and filter for the ones we need
    const allImages = getAllCacheSync("images");
    const images = entry?.ImageIds 
        ? allImages
            .filter(img => entry.ImageIds.includes(img.data.Id))
            .map(img => img.data)
        : [];

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Stack.Screen options={{ headerTitle: entry?.Title }} />
            <Floater>
                {images.map((image, i) => (
                    <View key={i} style={styles.posterLine}>
                        <Banner image={image} viewable />
                    </View>
                ))}
                <MarkdownContent>{entry?.Text ?? ""}</MarkdownContent>
                {entry?.Links?.map((link: LinkFragment) => (
                    <View style={styles.linkContainer} key={link.Target}>
                        <LinkItem link={link} />
                    </View>
                ))}
            </Floater>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    posterLine: {
        marginVertical: 10,
        alignItems: "center",
    },
    linkContainer: {
        marginBottom: 10,
    },
});