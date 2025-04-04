import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { chain } from 'lodash'
import Fuse from 'fuse.js'
import { useTranslation } from 'react-i18next'
import { KbSectionedList } from '@/components/kb/KbSectionedList'
import { Search } from '@/components/generic/atoms/Search'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'

export default function Knowledge() {
    const { t } = useTranslation('KnowledgeGroups')
    const { knowledgeGroups, knowledgeEntries } = useCache()
    const [filter, setFilter] = useState('')

    // Get knowledge groups and entries from cache
    const backgroundStyle = useThemeBackground('background')

    // Prepare data for search and display
    const groups = useMemo(() => {
        // Group entries by their group ID
        const groupedEntries = chain(knowledgeEntries.values)
            .groupBy('KnowledgeGroupId')
            .value()

        // Combine groups with their entries
        return knowledgeGroups.values.map(group => ({
            group,
            entries: groupedEntries[group.Id] || [],
        }))
    }, [knowledgeGroups, knowledgeEntries])

    // Setup search functionality
    const searchResults = useMemo(() => {
        if (!filter) return null

        const allItems = chain(groups)
            .flatMap(({ group, entries }) => [group, ...entries])
            .value()

        const fuse = new Fuse(allItems, {
            keys: ['Name', 'Description', 'Text'],
            threshold: 0.3,
        })

        return fuse.search(filter).map(result => result.item)
    }, [groups, filter])

    // Prepare final data for display
    const displayData = useMemo(() => {
        if (searchResults) return searchResults
        return chain(groups)
            .flatMap(({ group, entries }) => [group, ...entries])
            .value()
    }, [searchResults, groups])

    return (
        <View style={[StyleSheet.absoluteFill, backgroundStyle]}>
            <Header>{t('header')}</Header>
            <KbSectionedList
                kbGroups={displayData}
                leader={<Search filter={filter} setFilter={setFilter} />}
            />
        </View>
    )
}
