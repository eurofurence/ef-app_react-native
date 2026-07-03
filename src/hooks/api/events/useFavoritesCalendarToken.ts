import {
  type QueryFunctionContext,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import axios, { type GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'

async function getFavoritesCalendarToken(
  accessToken: string | null,
  signal?: GenericAbortSignal
) {
  if (!accessToken) throw new Error('Unauthorized')

  return await axios
    .get(`${apiBase}/Events/Favorites/:calendar-token`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as string)
}

export function useFavoritesCalendarToken(): UseQueryResult<string | null> {
  const { accessToken, idData, loggedIn } = useAuthContext()

  return useQuery({
    queryKey: [idData?.sub, 'favorites-calendar-token'],
    queryFn: (context: QueryFunctionContext) =>
      getFavoritesCalendarToken(accessToken, context.signal),
    enabled: loggedIn,
    retry: false,
  })
}
