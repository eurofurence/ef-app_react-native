import { useMutation } from '@tanstack/react-query'

import { useAuthContext } from '@/context/auth/Auth'
import { queryClient } from '@/context/query/Query'
import { ArtistsAlleyPostTableRegistrationData } from '@/hooks/api/artists-alley/ArtistsAlleyPostTableRegistrationData'

import { postArtistsAlleyPostTableRegistrationRequest } from './postArtistsAlleyPostTableRegistrationRequest'
/**
 * Uses a mutation for `postArtistsAlleyPostTableRegistrationRequest` with the app auth state.
 */
export function useArtistsAlleyTableRegistrationRequestMutation() {
  const { accessToken, idData } = useAuthContext()
  return useMutation({
    mutationFn: (data: ArtistsAlleyPostTableRegistrationData) => postArtistsAlleyPostTableRegistrationRequest(accessToken, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [idData?.sub, 'artists-alley'] }),
  })
}
