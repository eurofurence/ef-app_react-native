import { CommunicationRecord } from '@/context/data/types.api'
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'
import { useCallback } from 'react'

/**
 * Gets the communication records with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getCommunications(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/Communication/PrivateMessages`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as CommunicationRecord[])
}

/**
 * Uses a query for `getCommunications` with the app auth state.
 */
export function useCommunicationsQuery(): UseQueryResult<CommunicationRecord[] | null> {
  const { accessToken, claims } = useAuthContext()
  return useQuery({
    queryKey: [claims?.sub, 'communications'],
    queryFn: (context) => getCommunications(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}

/**
 * Uses a query for `getCommunications` with the app auth state. Applies an ID filter.
 * @param id The ID of the record, preferably a string.
 * @remarks Uses the same query as getting all records.
 */
export function useCommunicationsItemQuery(id: unknown): UseQueryResult<CommunicationRecord | null> {
  const { accessToken, claims } = useAuthContext()

  const findEntry = useCallback(
    (data: CommunicationRecord[] | null) => {
      return data?.find((item) => item.Id === id) ?? null
    },
    [id]
  )

  return useQuery({
    queryKey: [claims?.sub, 'communications'],
    queryFn: (context) => getCommunications(accessToken, context.signal),
    select: findEntry,
    placeholderData: (data) => keepPreviousData(data),
  })
}
