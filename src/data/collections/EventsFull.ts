import { createLiveQueryCollection, eq } from "@tanstack/react-db";
import { eventsCollection } from "@/data/collections/Events";
import { daysCollection } from "@/data/collections/Days";
import { tracksCollection } from "@/data/collections/Tracks";
import { roomsCollection } from "@/data/collections/Rooms";
import { imagesCollection } from "@/data/collections/Images";
import { favoriteEventsCollection } from "@/data/collections/FavoriteEvents";
import { IFuseOptions } from "fuse.js";
import { EfEvent } from "@/data/types/EfEvent";

export const eventsFullCollection = createLiveQueryCollection({
  id: "eventsFullCollection",
  query: (q) =>
    q
      .from({ event: eventsCollection })
      .innerJoin({ day: daysCollection }, ({ event, day }) => eq(event.ConferenceDayId, day.Id))
      .innerJoin({ track: tracksCollection }, ({ event, track }) => eq(event.ConferenceTrackId, track.Id))
      .innerJoin({ room: roomsCollection }, ({ event, room }) => eq(event.ConferenceRoomId, room.Id))
      .leftJoin({ banner: imagesCollection }, ({ event, banner }) => eq(event.BannerImageId, banner.Id))
      .leftJoin({ poster: imagesCollection }, ({ event, poster }) => eq(event.PosterImageId, poster.Id))
      .leftJoin({ favorite: favoriteEventsCollection }, ({ event, favorite }) => eq(event.Id, favorite.Id))
      .select((result) => ({
        ...result.event,
        Day: result.day,
        Track: result.track,
        Room: result.room,
        Banner: result.banner,
        Poster: result.poster,
        Favorite: result.favorite,
      })),
  getKey(item) {
    return item.Id;
  },
  utils: {
    searchable: {
      keys: ["Title", "SubTitle", "Abstract", "Description"],
    } satisfies IFuseOptions<EfEvent>,
  },
});
