import { eq, isUndefined, not, useLiveQuery } from '@tanstack/react-db'
import { isAfter } from 'date-fns'
import { dealersFullCollection } from '@/data/collections/content/DealersFull'
import { eventsFullCollection } from '@/data/collections/content/EventsFull'
import { lastViewTimesCollection } from '@/data/collections/supplemental/LastViewTimes'
import { parseDefaultISO } from '@/util/parseDefaultISO'

/**
 * Uses the state of user favorite events and dealers. Also returns the last
 * viewed times as a record of ID to formatted time.
 */
export function useFavoritesUpdated() {
  const { data: events } = useLiveQuery({
    id: 'updated-events',
    query: (q) =>
      q
        .from({ event: eventsFullCollection })
        .where(({ event }) => not(isUndefined(event.Favorite)))
        .innerJoin({ view: lastViewTimesCollection }, ({ event, view }) =>
          eq(event.Id, view.Id)
        )
        .fn.where(({ event, view }) =>
          isAfter(parseDefaultISO(event.LastChangeDateTimeUtc), view.Time)
        )
        .select(({ event }) => event),
  })
  const { data: dealers } = useLiveQuery({
    id: 'updated-dealers',
    query: (q) =>
      q
        .from({ dealer: dealersFullCollection })
        .where(({ dealer }) => not(isUndefined(dealer.Favorite)))
        .innerJoin({ view: lastViewTimesCollection }, ({ dealer, view }) =>
          eq(dealer.Id, view.Id)
        )
        .fn.where(({ dealer, view }) =>
          isAfter(parseDefaultISO(dealer.LastChangeDateTimeUtc), view.Time)
        )
        .select(({ dealer }) => dealer),
  })

  return { events, dealers }
}
