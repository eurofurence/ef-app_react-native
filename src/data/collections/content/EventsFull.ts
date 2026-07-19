import { createLiveQueryCollection, eq } from '@tanstack/react-db'
import type {CollectionItem} from '@/data/collections/CollectionItem'
import { daysCollection } from '@/data/collections/content/Days'
import { eventsCollection } from '@/data/collections/content/Events'
import { favoriteEventsCollection } from '@/data/collections/supplemental/FavoriteEvents'
import { hiddenEventsCollection } from '@/data/collections/supplemental/HiddenEvents'
import { imagesCollection } from '@/data/collections/content/Images'
import { roomsCollection } from '@/data/collections/content/Rooms'
import { tracksCollection } from '@/data/collections/content/Tracks'
import { defineSearch } from '@/data/searching/useSearch'

export const eventsFullCollection = createLiveQueryCollection({
  id: 'eventsFullCollection',
  query: (q) =>
    q
      .from({ event: eventsCollection })
      .innerJoin({ day: daysCollection }, ({ event, day }) =>
        eq(event.ConferenceDayId, day.Id)
      )
      .innerJoin({ track: tracksCollection }, ({ event, track }) =>
        eq(event.ConferenceTrackId, track.Id)
      )
      .innerJoin({ room: roomsCollection }, ({ event, room }) =>
        eq(event.ConferenceRoomId, room.Id)
      )
      .join({banner: imagesCollection}, ({event, banner}) =>
        eq(event.BannerImageId, banner.Id)
      )
      .join({poster: imagesCollection}, ({event, poster}) =>
        eq(event.PosterImageId, poster.Id)
      )
      .join({favorite: favoriteEventsCollection}, ({event, favorite}) =>
        eq(event.Id, favorite.Id)
      )
      .join({hidden: hiddenEventsCollection}, ({event, hidden}) =>
        eq(event.Id, hidden.Id)
      )
      .select(({banner, day, event, favorite, hidden, poster, room, track}) => ({
        ...event,
        Day: day,
        Track: track,
        Room: room,
        Banner: banner ? banner : null,
        Poster: poster ? poster : null,
        Favorite: favorite ? favorite : null,
        Hidden: hidden ? hidden : null,
      })),
  getKey(item) {
    return item.Id
  },
})

export type EfEventFull = CollectionItem<typeof eventsFullCollection>

defineSearch(eventsFullCollection, {
  keys: ['Title', 'SubTitle', 'Abstract', 'Description'],
})
