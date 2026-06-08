import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'

import type { TableRegistrationRecord } from '@/context/data/types.api'
import { api } from '@/data/clients/api'

/**
 * Uses a query for `getArtistsAlleyOwnRegistration` with the app auth state.
 */
export function useArtistsAlleyOwnRegistrationQuery(): UseQueryResult<TableRegistrationRecord | null> {
  return useQuery({
    queryKey: ['artists-alley', 'own-registration'],
    queryFn: ({ signal }) =>
      api
        .get(`/ArtistsAlley/TableRegistration/:my-latest`, {
          signal: signal,
          validateStatus: (status) =>
            (status <= 200 && status < 300) || status === 404,
        })
        .then((res) =>
          res.status === 404 ? null : (res.data as TableRegistrationRecord)
        ),
    placeholderData: (data) => keepPreviousData(data),
  })
}
