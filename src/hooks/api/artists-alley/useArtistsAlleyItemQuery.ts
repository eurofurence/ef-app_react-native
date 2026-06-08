import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import type { TableRegistrationRecord } from '@/context/data/types.api'
import { api } from '@/data/clients/api'

/**
 * Returns a query on getting an artists alley item by ID.
 * @param id The ID of the item.
 */
export function useArtistsAlleyItemQuery(
  id: unknown
): UseQueryResult<TableRegistrationRecord | null> {
  return useQuery({
    queryKey: ['artists-alley', id],
    queryFn: ({ signal }) =>
      api
        .get(`/ArtistsAlley/${id}`, { signal: signal })
        .then((res) => res.data as TableRegistrationRecord),
    placeholderData: (data) => keepPreviousData(data),
  })
}
