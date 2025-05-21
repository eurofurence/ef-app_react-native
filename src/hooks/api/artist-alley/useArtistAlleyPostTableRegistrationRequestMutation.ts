import { useAuthContext } from '@/context/auth/Auth'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/context/query/Query'
import { useCallback } from 'react'
import { ArtistAlleyPostTableRegistrationData } from '@/hooks/api/artist-alley/ArtistAlleyPostTableRegistrationData'
import { postArtistAlleyPostTableRegistrationRequest } from './postArtistAlleyPostTableRegistrationRequest'
/**
 * Uses a mutation for `postArtistAlleyPostTableRegistrationRequest` with the app auth state.
 */
export function useArtistAlleyPostTableRegistrationRequestMutation() {
  const { accessToken, claims } = useAuthContext()
  const mutationFn = useCallback((data: ArtistAlleyPostTableRegistrationData) => postArtistAlleyPostTableRegistrationRequest(accessToken, data), [accessToken])
  return useMutation({
    mutationFn: mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [claims?.sub, 'artist-alley-own-registration'] }),
  })
}
