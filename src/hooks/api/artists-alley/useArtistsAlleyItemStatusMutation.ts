import { useAuthContext } from '@/context/auth/Auth'
import { useMutation } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'
import { queryClient } from '@/context/query/Query'
import { TableRegistrationRecordStatus } from '@/context/data/types.api'

/**
 * ID/Status data.
 */
export type ArtistsAlleyItemStatusData = {
  id: unknown
  status: TableRegistrationRecordStatus
}

/**
 * Puts an artist alley status to the API with the given access token, item ID, status, and optionally an abort signal.
 * @param accessToken The access token.
 * @param data The ID/status data.
 * @param signal An abort signal.
 */
export async function putArtistsAlleyItemStatus(accessToken: string | null, data: ArtistsAlleyItemStatusData, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios.put(`${apiBase}/ArtistsAlley/${data.id}/:status`, data.status, {
    signal: signal,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Uses a mutation for `putArtistsAlleyItemStatus` with the app auth state.
 */
export function useArtistsAlleyItemStatusMutation() {
  const { accessToken, claims } = useAuthContext()
  return useMutation({
    mutationFn: (data: ArtistsAlleyItemStatusData) => putArtistsAlleyItemStatus(accessToken, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [claims?.sub, 'artists-alley'] }),
  })
}
