import { useMutation } from '@tanstack/react-query'
import { api } from '@/data/clients/api'

/**
 * Returns a mutation to "checkout self", i.e., deleting "my-latest".
 */
export function useArtistsAlleyCheckOutMutation() {
  return useMutation({
    mutationFn: () =>
      api.delete(`/ArtistsAlley/TableRegistration/:my-latest`, {
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
