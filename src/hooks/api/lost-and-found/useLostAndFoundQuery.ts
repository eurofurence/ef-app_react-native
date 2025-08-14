import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'
import { useCallback } from 'react'

import { apiBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { LostAndFoundRecord } from '@/context/data/types.api'

/**
 * Gets the lost and found records with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getLostAndFound(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/LostAndFound/Items`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as LostAndFoundRecord[])
}

/**
 * Uses a query for `getLostAndFound` with the app auth state.
 */
export function useLostAndFoundQuery(): UseQueryResult<LostAndFoundRecord[] | null> {
  const { accessToken, idData } = useAuthContext()
  return useQuery({
    queryKey: [idData?.sub, 'lost-and-found'],
    queryFn: (context) => getLostAndFound(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}

/**
 * Uses a query for `getLostAndFound` with the app auth state. Applies an ID filter.
 * @param id The ID of the record, preferably a string.
 * @remarks Uses the same query as getting all records.
 */
export function useLostAndFoundItemQuery(id: unknown): UseQueryResult<LostAndFoundRecord | null> {
  const { accessToken, idData } = useAuthContext()

  const findEntry = useCallback(
    (data: LostAndFoundRecord[] | null) => {
      return data?.find((item) => item.Id === id) ?? null
    },
    [id]
  )

  return useQuery({
    queryKey: [idData?.sub, 'lost-and-found'],
    queryFn: (context) => getLostAndFound(accessToken, context.signal),
    select: findEntry,
    placeholderData: (data) => keepPreviousData(data),
  })
}
