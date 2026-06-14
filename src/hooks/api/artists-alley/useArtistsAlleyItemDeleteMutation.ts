import { useMutation } from '@tanstack/react-query'
import { api } from '@/data/clients/api'

/**
 * Returns a mutation to delete an artists alley item by ID.
 */
export function useArtistsAlleyItemDeleteMutation() {
  return useMutation({
    mutationFn: (id: unknown) => api.delete(`/ArtistsAlley/${id}`),
    onSuccess: (_data, _variables, _onMutateResult, { client }) =>
      client.invalidateQueries({
        queryKey: ['artists-alley'],
      }),
  })
}
