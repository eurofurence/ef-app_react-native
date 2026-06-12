import {
  keepPreviousData,
  type QueryFunctionContext,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'

import { api } from '@/data/clients/api'
import { useAuthState } from '@/data/clients/auth'

export function useUserDatamatrix(): UseQueryResult<string | null> {
  const { isLoggedIn } = useAuthState()
  return useQuery({
    queryKey: ['datamatrix'],
    queryFn: ({ signal }: QueryFunctionContext) =>
      api
        .get(`/Users/Pass`, {
          signal: signal,
          responseType: 'text',
          transformResponse: (data) => data,
          params: {
            imageType: 'image/svg+xml',
          },
        })
        .then((res) => res.data),
    placeholderData: (data) => keepPreviousData(data),
    retry: false,
    enabled: isLoggedIn,
  })
}
