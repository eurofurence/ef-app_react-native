import { createLiveQueryCollection, eq } from '@tanstack/react-db'
import { kbEntriesCollection } from '@/data/collections/KbEntries'
import { kbGroupsCollection } from '@/data/collections/KbGroups'
import { defineSearch } from '@/data/searching/useSearch'

export const kbGroupsFullCollection = createLiveQueryCollection({
  id: 'kbGroupsFullCollection',
  query: (q) =>
    q.from({ kbGroup: kbGroupsCollection }).select((result) => ({
      ...result.kbGroup,
      Entries: q
        .from({ kbEntry: kbEntriesCollection })
        .where(({ kbEntry }) =>
          eq(kbEntry.KnowledgeGroupId, result.kbGroup.Id)
        ),
    })),
  getKey(item) {
    return item.Id
  },
})

defineSearch(kbGroupsCollection, {
  keys: ['Name', 'Description'],
})
