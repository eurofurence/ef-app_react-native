import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, StyleSheet } from 'react-native'
import { chain, isEmpty, partition, startCase } from 'lodash'
import { router } from 'expo-router'

import { Label } from '@/components/generic/atoms/Label'
import { Header } from '@/components/generic/containers/Header'
import { PrivateMessageCard } from '@/components/messages/PrivateMessageCard'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { NoData } from '@/components/generic/containers/NoData'
import { useCache } from '@/context/data/DataCache'
import { CommunicationRecord } from '@/context/data/types'

type Section = {
    title: string;
    data: CommunicationRecord[];
};

export default function PmList() {
    const { t } = useTranslation('PrivateMessageList')
    const { getEntityValues, isSynchronizing, synchronizeUi } = useCache()
    const messages = getEntityValues('communications')
    const navigateTo = useCallback(
        (item: CommunicationRecord) =>
            router.push({
                pathname: '/messages/[messageId]',
                params: { messageId: item.Id },
            }),
        [],
    )

    const sectionedData = useMemo(() => {
        const [unread, read] = partition(messages, (it: CommunicationRecord) => it.ReadDateTimeUtc === null)

        const readSections = chain(read)
            .orderBy(['AuthorName', 'SentDateTimeUtc'], ['asc', 'desc'])
            .groupBy((it: CommunicationRecord) => (it.AuthorName ? t('from', { author: it.AuthorName?.trim() }) : t('from_unknown')))
            .map((messages, author) => ({
                title: author,
                data: messages,
            }))
            .value()

        const unreadSections = isEmpty(unread)
            ? []
            : [
                {
                    title: t('unread'),
                    data: unread,
                },
            ]

        return [...unreadSections, ...readSections] as Section[]
    }, [messages, t])

    const sectionStyle = useThemeBackground('background')

    const keyExtractor = useCallback(({ Id }: CommunicationRecord, index: number) => Id + index, [])
    const emptyComponent = useMemo(() => <NoData text={t('no_data')} />, [t])
    const headerComponent = useMemo(() => <Header>{t('header')}</Header>, [t])

    const renderSection = useCallback(
        ({ section }: { section: Section }) => (
            <Label type="h2" style={[styles.section, sectionStyle]}>
                {startCase(section.title)}
            </Label>
        ),
        [sectionStyle],
    )

    const renderItem = useCallback(
        ({ item }: { item: CommunicationRecord }) => (
            <PrivateMessageCard
                key={item.Id}
                containerStyle={styles.item}
                onPress={() => navigateTo(item)}
                item={item}
            />
        ),
        [navigateTo],
    )

    const backgroundStyle = useThemeBackground('background')

    return (
        <SectionList<CommunicationRecord, Section>
            style={[StyleSheet.absoluteFill, backgroundStyle]}
            sections={sectionedData}
            contentContainerStyle={styles.container}
            keyExtractor={keyExtractor}
            stickySectionHeadersEnabled
            onRefresh={synchronizeUi}
            refreshing={isSynchronizing}
            ListEmptyComponent={emptyComponent}
            ListHeaderComponent={headerComponent}
            renderSectionHeader={renderSection}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({
    section: {
        padding: 20,
    },
    action: {
        flex: 3,
    },
    item: {
        paddingHorizontal: 20,
    },
    container: {
        paddingBottom: 100,
    },
})
