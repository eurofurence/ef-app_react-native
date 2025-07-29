import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { chain } from 'lodash'
import Fuse from 'fuse.js'
import { useTranslation } from 'react-i18next'
import { KbSectionedList } from '@/components/kb/KbSectionedList'
import { Search } from '@/components/generic/atoms/Search'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'
import { useFuseResults } from '@/hooks/searching/useFuseResults'

export default function Knowledge() {
  const { t } = useTranslation('KnowledgeGroups')
  const { knowledgeGroups, knowledgeEntries, searchKnowledgeEntries } = useCache()
  const [filter, setFilter] = useState('')

  // Use the pre-configured search functionality for entries
  const searchResults = useFuseResults(searchKnowledgeEntries, filter)

  // Prepare data for search and display
  const groups = useMemo(() => {
    // Group entries by their group ID
    const groupedEntries = chain(knowledgeEntries).groupBy('KnowledgeGroupId').value()

    // Combine groups with their entries
    return knowledgeGroups.map((group) => ({
      group,
      entries: groupedEntries[group.Id] || [],
    }))
  }, [knowledgeGroups, knowledgeEntries])

  // Prepare final data for display
  const displayData = useMemo(() => {
    if (searchResults && filter.length > 0) {
      // When searching, maintain proper group structure
      const matchingEntries = searchResults
      const matchingGroupIds = new Set(matchingEntries.map((entry) => entry.KnowledgeGroupId))

      // Also search in group names and descriptions with better settings
      const groupFuse = new Fuse(knowledgeGroups, {
        keys: [
          { name: 'Name', weight: 2 },
          { name: 'Description', weight: 1 },
        ],
        threshold: 0.3, // Use same threshold as entries for consistency
        ignoreLocation: true,
        includeScore: true,
      })
      const groupSearchResults = groupFuse.search(filter)
      const matchingGroupsFromSearch = groupSearchResults.map((result) => result.item)

      // Get all groups that either contain matching entries or match the search themselves
      const allRelevantGroups = knowledgeGroups.filter((group) => matchingGroupIds.has(group.Id) || matchingGroupsFromSearch.includes(group))

      // Build proper sectioned structure
      const result: ((typeof knowledgeGroups)[0] | (typeof knowledgeEntries)[0])[] = []

      for (const group of allRelevantGroups) {
        result.push(group)

        // Add matching entries for this group
        const groupEntries = matchingEntries.filter((entry) => entry.KnowledgeGroupId === group.Id)
        result.push(...groupEntries)

        // If group matched search but has no matching entries, show all entries from that group
        if (matchingGroupsFromSearch.includes(group) && groupEntries.length === 0) {
          const allGroupEntries = knowledgeEntries.filter((entry) => entry.KnowledgeGroupId === group.Id)
          result.push(...allGroupEntries)
        }
      }

      return result
    }

    // Normal display: show all groups and entries in proper structure
    return chain(groups)
      .flatMap(({ group, entries }) => [group, ...entries])
      .value()
  }, [searchResults, groups, knowledgeGroups, knowledgeEntries, filter])

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('header')}</Header>
      <KbSectionedList kbGroups={displayData} leader={<Search filter={filter} setFilter={setFilter} />} />
    </View>
  )
}
