import { useMutation } from '@tanstack/react-query'
import type { ArtistsAlleyPostTableRegistrationData } from '@/hooks/api/artists-alley/ArtistsAlleyPostTableRegistrationData'
import { postArtistsAlleyPostTableRegistrationRequest } from './postArtistsAlleyPostTableRegistrationRequest'

/**
 * Returns a mutation to request an artists alley table.
 */
export function useArtistsAlleyTableRegistrationRequestMutation() {
  return useMutation({
    mutationFn: (data: ArtistsAlleyPostTableRegistrationData) =>
      postArtistsAlleyPostTableRegistrationRequest(data),
    onSuccess: (_data, _variables, _onMutateResult, { client }) =>
      client.invalidateQueries({
        queryKey: ['artists-alley'],
      }),
  })
}
