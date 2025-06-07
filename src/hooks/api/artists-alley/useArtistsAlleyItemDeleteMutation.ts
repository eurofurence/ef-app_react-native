import { useAuthContext } from '@/context/auth/Auth'
import { useMutation } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'
import { queryClient } from '@/context/query/Query'

/**
 * Deletes an artist alley item with the API with the given access token, item ID, and optionally an abort signal.
 * @param accessToken The access token.
 * @param id The ID of the item.
 * @param signal An abort signal.
 */
export async function deleteArtistsAlleyItem(accessToken: string | null, id: unknown, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios.delete(`${apiBase}/ArtistsAlley/${id}`, {
    signal: signal,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

/**
 * Uses a mutation for `putArtistsAlleyItemStatus` with the app auth state.
 */
export function useArtistsAlleyItemDeleteMutation() {
  const { accessToken, claims } = useAuthContext()
  return useMutation({
    mutationFn: (id: unknown) => deleteArtistsAlleyItem(accessToken, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [claims?.sub, 'artists-alley'] }),
  })
}
