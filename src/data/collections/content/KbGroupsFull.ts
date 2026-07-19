import {createLiveQueryCollection, eq, toArray} from '@tanstack/react-db'
import type {CollectionItem} from '@/data/collections/CollectionItem'
import {kbEntriesCollection} from '@/data/collections/content/KbEntries'
import {kbGroupsCollection} from '@/data/collections/content/KbGroups'
import { defineSearch } from '@/data/searching/useSearch'

export const kbGroupsFullCollection = createLiveQueryCollection({
  id: 'kbGroupsFullCollection',
  query: (q) =>
    q.from({kbGroup: kbGroupsCollection})
      .orderBy(({kbGroup}) => kbGroup.Order)
      .select((result) => ({
      ...result.kbGroup,
        Entries: toArray(q
        .from({ kbEntry: kbEntriesCollection })
        .where(({ kbEntry }) =>
          eq(kbEntry.KnowledgeGroupId, result.kbGroup.Id)
        )
          .orderBy(({kbEntry}) => kbEntry.Order)),
    })),
  getKey(item) {
    return item.Id
  },
})

export type EfKbGroupFull = CollectionItem<typeof kbGroupsCollection>

defineSearch(kbGroupsCollection, {
  keys: ['Name', 'Description'],
})
