import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import { useCallback } from 'react'

import type { CommunicationRecord } from '@/context/data/types.api'
import { api } from '@/data/clients/api'

/**
 * Returns a query on the communications items.
 */
export function useCommunicationsQuery(): UseQueryResult<
  CommunicationRecord[] | null
> {
  return useQuery({
    queryKey: ['communications'],
    queryFn: ({ signal }) =>
      api
        .get(`/Communication/PrivateMessages`, {
          signal: signal,
        })
        .then((res) => res.data as CommunicationRecord[]),
    placeholderData: (data) => keepPreviousData(data),
  })
}

/**
 * Returns a query on the communications items and applies an ID filter.
 * @param id The ID of the record, preferably a string.
 * @remarks Uses the same query as getting all records.
 */
export function useCommunicationsItemQuery(
  id: unknown
): UseQueryResult<CommunicationRecord | null> {
  const findEntry = useCallback(
    (data: CommunicationRecord[] | null) => {
      return data?.find((item) => item.Id === id) ?? null
    },
    [id]
  )

  return useQuery({
    queryKey: ['communications'],
    queryFn: ({ signal }) =>
      api
        .get(`/Communication/PrivateMessages`, {
          signal: signal,
        })
        .then((res) => res.data as CommunicationRecord[]),
    select: findEntry,
    placeholderData: (data) => keepPreviousData(data),
  })
}
