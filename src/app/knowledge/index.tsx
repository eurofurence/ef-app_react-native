import { Search } from '@/components/generic/atoms/Search'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Header } from '@/components/generic/containers/Header'
import { KbSectionedList } from '@/components/kb/KbSectionedList'
import { useCache } from '@/context/data/Cache'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import Fuse from 'fuse.js'
import { chain } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

export default function Knowledge() {
  const { t } = useTranslation('KnowledgeGroups')
  const { t: a11y } = useTranslation('KnowledgeGroups')
  const { knowledgeGroups, knowledgeEntries, searchKnowledgeEntries } = useCache()
  const [filter, setFilter] = useState('')
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

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
        // Add matching entries for this group
        const groupEntries = matchingEntries.filter((entry) => entry.KnowledgeGroupId === group.Id)

        // If group matched search but has no matching entries, show all entries from that group
        if (matchingGroupsFromSearch.includes(group) && groupEntries.length === 0) {
          const allGroupEntries = knowledgeEntries.filter((entry) => entry.KnowledgeGroupId === group.Id)
          if (allGroupEntries.length > 0) {
            result.push(group)
            result.push(...allGroupEntries)
          }
        } else if (groupEntries.length > 0) {
          // Only add group and entries if there are matching entries
          result.push(group)
          result.push(...groupEntries)
        }
      }

      return result
    }

    // Normal display: show all groups and entries in proper structure, but hide empty groups
    return chain(groups)
      .filter(({ entries }) => entries.length > 0) // Only include groups that have entries
      .flatMap(({ group, entries }) => [group, ...entries])
      .value()
  }, [searchResults, groups, knowledgeGroups, knowledgeEntries, filter])

  // Announce search results to screen readers
  useEffect(() => {
    if (filter && searchResults) {
      const count = searchResults.length
      if (count === 0) {
        const message = a11y('accessibility.no_search_results', { query: filter })
        setAnnouncementMessage(message)
      } else {
        const message = a11y('accessibility.search_results', { count, query: filter })
        setAnnouncementMessage(message)
      }
    } else if (!filter) {
      setAnnouncementMessage('')
    }
  }, [filter, searchResults, a11y])

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage message={announcementMessage} type="polite" visible={false} />

      <View
        style={StyleSheet.absoluteFill}
        ref={mainContentRef}
        accessibilityLabel={a11y('accessibility.kb_sectioned_list')}
        accessibilityHint={a11y('accessibility.kb_sectioned_list_hint')}
      >
        <Header>{t('header')}</Header>
        <KbSectionedList kbGroups={displayData} leader={<Search filter={filter} setFilter={setFilter} />} />
      </View>
    </>
  )
}
