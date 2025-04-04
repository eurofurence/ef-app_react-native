import { useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Banner } from '@/components/generic/atoms/Banner'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { Floater } from '@/components/generic/containers/Floater'
import { LinkItem } from '@/components/maps/LinkItem'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Header } from '@/components/generic/containers/Header'
import { LinkFragment } from '@/context/data/types'
import { useCache } from '@/context/data/Cache'

export default function KnowledgeId() {
    const { knowledgeId } = useLocalSearchParams<{ knowledgeId: string }>()
    const { knowledgeEntries } = useCache()
    const backgroundStyle = useThemeBackground('background')

    // Get the knowledge entry from cache
    const entry = knowledgeEntries.dict[knowledgeId]

    return (
        <ScrollView style={[StyleSheet.absoluteFill, backgroundStyle]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{entry?.Title}</Header>
            <Floater>
                {entry?.Images?.map((image, i) => (
                    <View key={i} style={styles.posterLine}>
                        <Banner image={image} viewable />
                    </View>
                )) ?? null}
                <MarkdownContent>{entry?.Text ?? ''}</MarkdownContent>
                {entry?.Links?.map((link: LinkFragment) => (
                    <View style={styles.linkContainer} key={link.Target}>
                        <LinkItem link={link} />
                    </View>
                ))}
            </Floater>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    posterLine: {
        marginVertical: 10,
        alignItems: 'center',
    },
    linkContainer: {
        marginBottom: 10,
    },
})
