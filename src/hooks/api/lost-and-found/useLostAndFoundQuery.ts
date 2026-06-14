import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import { useCallback } from 'react'
import type { LostAndFoundRecord } from '@/context/data/types.api'
import { api } from '@/data/clients/api'

/**
 * Uses a query for lost-and-found items.
 */
export function useLostAndFoundQuery(): UseQueryResult<
  LostAndFoundRecord[] | null
> {
  return useQuery({
    queryKey: ['lost-and-found'],
    queryFn: ({ signal }) =>
      api
        .get(`/LostAndFound/Items`, {
          signal: signal,
        })
        .then((res) => res.data as LostAndFoundRecord[]),
    placeholderData: (data) => keepPreviousData(data),
  })
}

/**
 * Uses a query for lost-and-found items and applies an ID filter.
 * @param id The ID of the record, preferably a string.
 * @remarks Uses the same query as getting all records.
 */
export function useLostAndFoundItemQuery(
  id: unknown
): UseQueryResult<LostAndFoundRecord | null> {
  const findEntry = useCallback(
    (data: LostAndFoundRecord[] | null) => {
      return data?.find((item) => item.Id === id) ?? null
    },
    [id]
  )

  return useQuery({
    queryKey: ['lost-and-found'],
    queryFn: ({ signal }) =>
      api
        .get(`/LostAndFound/Items`, {
          signal: signal,
        })
        .then((res) => res.data as LostAndFoundRecord[]),
    select: findEntry,
    placeholderData: (data) => keepPreviousData(data),
  })
}
