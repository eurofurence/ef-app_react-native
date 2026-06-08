import { useMutation } from '@tanstack/react-query'
import type { TableRegistrationRecordStatus } from '@/context/data/types.api'
import { api } from '@/data/clients/api'

/**
 * ID/Status data.
 */
export type ArtistsAlleyItemStatusData = {
  id: unknown
  status: TableRegistrationRecordStatus
}

/**
 * Returns a mutation to update an artists alley item status.
 */
export function useArtistsAlleyItemStatusMutation() {
  return useMutation({
    mutationFn: (data: ArtistsAlleyItemStatusData) =>
      api.put(`/ArtistsAlley/${data.id}/:status`, data.status, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    onSuccess: (_data, _variables, _onMutateResult, { client }) =>
      client.invalidateQueries({
        queryKey: ['artists-alley'],
      }),
  })
}
