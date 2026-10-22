import { useLiveQuery } from '@tanstack/react-db'
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import type { IconNames } from '@/components/generic/atoms/Icon'
import { Search } from '@/components/generic/atoms/Search'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Header } from '@/components/generic/containers/Header'
import { EfSectionList } from '@/components/generic/lists/EfLists'
import { KbEntryCard } from '@/components/kb/KbEntryCard'
import { KbSection } from '@/components/kb/KbSection'
import { kbEntriesCollection } from '@/data/collections/content/KbEntries'
import { kbGroupsCollection } from '@/data/collections/content/KbGroups'
import { kbGroupsFullCollection } from '@/data/collections/content/KbGroupsFull'
import { synchronize, useIsSynchronizing } from '@/data/hooks/useSynchronize'
import { useSearchIds } from '@/data/searching/useSearch'
import type { EfKbEntry } from '@/data/types/EfKbEntry'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { vibrateAfter } from '@/util/vibrateAfter'

type KnowledgeSection = {
  name: string
  description: string
  icon: IconNames
}

export function onPressKbEntry(entry: EfKbEntry) {
  router.navigate({
    pathname: '/knowledge/[id]',
    params: { id: entry.Id },
  })
}

export default function Knowledge() {
  const { t } = useTranslation('KnowledgeGroups')
  const isSynchronizing = useIsSynchronizing()
  const { data: knowledgeGroups } = useLiveQuery(kbGroupsFullCollection)

  const [query, setQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

  // Use the pre-configured search functionality for entries
  const resultGroups = useSearchIds(kbGroupsCollection, query)
  const resultEntries = useSearchIds(kbEntriesCollection, query)

  // Prepare data for search and display
  const grouping = useMemo(() => {
    const result: (KnowledgeSection | EfKbEntry)[] = []
    for (const group of knowledgeGroups) {
      // Was search result for group; or, is parent of an entry search result.
      const includedAsGroup = resultGroups?.includes(group.Id) !== false
      const includedAsParent = group.Entries.some(
        (item) => resultEntries?.includes(item.Id) !== false
      )
      if (!includedAsGroup && !includedAsParent) continue

      // Add section header.
      result.push({
        name: group.Name,
        description: group.Description,
        icon: group.FontAwesomeIconName || 'bookmark',
      } satisfies KnowledgeSection)

      // Add matching (or all) entries.
      for (const item of group.Entries) {
        const includedAsChild = resultEntries?.includes(item.Id) !== false
        if (includedAsChild) result.push(item)
      }
    }
    return result
  }, [knowledgeGroups, resultGroups, resultEntries])

  // Status messages for accessibility feedback
  const statusMessage = useMemo(() => {
    if (query && resultGroups && resultEntries) {
      const count = resultGroups.length + resultEntries.length
      if (count === 0) {
        return t('accessibility.no_search_results', { query: query })
      }
      return t('accessibility.search_results', { count, query: query })
    }
    return ''
  }, [query, resultGroups, resultEntries, t])

  // Handle search feedback
  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => {
        setSearchMessage(statusMessage)
      }, 300) // Debounce search announcements
      return () => clearTimeout(timer)
    } else {
      setSearchMessage('')
    }
  }, [query, statusMessage])

  const listHeaderComponent = (
    <Search
      className='my-2.5 mx-2.5'
      filter={query}
      setFilter={setQuery}
      placeholder={t('search.placeholder')}
    />
  )

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage message={searchMessage} type='polite' visible={false} />

      <View
        style={StyleSheet.absoluteFill}
        ref={mainContentRef}
        accessibilityLabel={t('accessibility.kb_sectioned_list')}
        accessibilityHint={t('accessibility.kb_sectioned_list_hint')}
      >
        <Header>{t('header')}</Header>
        <View className='flex-1'>
          <EfSectionList<KnowledgeSection, EfKbEntry>
            refreshing={isSynchronizing}
            onRefresh={() => vibrateAfter(synchronize())}
            scrollEnabled={true}
            contentContainerClassName='pb-32'
            ListHeaderComponent={listHeaderComponent}
            data={grouping}
            renderSection={({ item }) => {
              return (
                <KbSection
                  style={styles.item}
                  title={item.name}
                  subtitle={item.description}
                  icon={item.icon}
                />
              )
            }}
            renderItem={({ item }) => {
              return (
                <KbEntryCard
                  containerStyle={styles.item}
                  entry={item}
                  onPress={onPressKbEntry}
                />
              )
            }}
            accessibilityLabel={t('accessibility.kb_sectioned_list')}
            accessibilityHint={t('accessibility.kb_sectioned_list_hint')}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
