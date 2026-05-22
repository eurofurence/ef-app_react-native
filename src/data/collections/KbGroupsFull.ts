import {createLiveQueryCollection, eq} from "@tanstack/react-db";
import {kbGroupsCollection} from '@/data/collections/KbGroups';
import {kbEntriesCollection} from '@/data/collections/KbEntries';

export const kbGroupsFullCollection = createLiveQueryCollection(q =>
    q.from({kbGroup: kbGroupsCollection})
        .select(result => ({
            ...result.kbGroup,
            Entries: q.from(({kbEntry: kbEntriesCollection}))
                .where(({kbEntry}) => eq(kbEntry.KnowledgeGroupId, result.kbGroup.Id))
        }))
)

