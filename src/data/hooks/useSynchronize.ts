import { useIsFetching } from '@tanstack/react-query'
import { queryClient } from '@/data/clients/query'
import { artistsAlleyCollection } from '@/data/collections/artists-alley/ArtistsAlley'
import { announcementsCollection } from '@/data/collections/content/Announcements'
import { daysCollection } from '@/data/collections/content/Days'
import { dealersCollection } from '@/data/collections/content/Dealers'
import { eventsCollection } from '@/data/collections/content/Events'
import { imagesCollection } from '@/data/collections/content/Images'
import { kbEntriesCollection } from '@/data/collections/content/KbEntries'
import { kbGroupsCollection } from '@/data/collections/content/KbGroups'
import { lostAndFoundCollection } from '@/data/collections/content/LostAndFound'
import { mapsCollection } from '@/data/collections/content/Maps'
import { roomsCollection } from '@/data/collections/content/Rooms'
import { tracksCollection } from '@/data/collections/content/Tracks'

export async function synchronize() {
  await Promise.all([
    announcementsCollection.utils.refetch(),
    artistsAlleyCollection.utils.refetch(),
    daysCollection.utils.refetch(),
    dealersCollection.utils.refetch(),
    eventsCollection.utils.refetch(),
    imagesCollection.utils.refetch(),
    kbEntriesCollection.utils.refetch(),
    kbGroupsCollection.utils.refetch(),
    lostAndFoundCollection.utils.refetch(),
    mapsCollection.utils.refetch(),
    roomsCollection.utils.refetch(),
    tracksCollection.utils.refetch(),
  ])
}

export function useIsSynchronizing() {
  const count = useIsFetching(
    {
      predicate(query) {
        return query.meta?.collection === true
      },
    },
    queryClient
  )

  return 0 < count
}
