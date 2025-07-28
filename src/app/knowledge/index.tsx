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
    if (searchResults) {
      // When searching, we need to include both groups and matching entries
      const matchingEntries = searchResults
      const matchingGroupIds = new Set(matchingEntries.map((entry) => entry.KnowledgeGroupId))
      const matchingGroups = knowledgeGroups.filter((group) => matchingGroupIds.has(group.Id))

      // Also search in group descriptions
      const groupFuse = new Fuse(knowledgeGroups, {
        keys: ['Name', 'Description'],
        threshold: 0.3,
      })
      const matchingGroupsFromSearch = groupFuse.search(filter).map((result) => result.item)

      // Combine all matching groups and entries
      const allMatchingGroups = [...matchingGroups, ...matchingGroupsFromSearch]
      const uniqueGroups = allMatchingGroups.filter((group, index, self) => index === self.findIndex((g) => g.Id === group.Id))

      return [...uniqueGroups, ...matchingEntries]
    }

    // Normal display: show all groups and entries
    return chain(groups)
      .flatMap(({ group, entries }) => [group, ...entries])
      .value()
  }, [searchResults, groups, knowledgeGroups, filter])

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('header')}</Header>
      <KbSectionedList kbGroups={displayData} leader={<Search filter={filter} setFilter={setFilter} />} />
    </View>
  )
}
