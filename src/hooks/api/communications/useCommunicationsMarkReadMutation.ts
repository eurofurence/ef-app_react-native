import { useMutation } from '@tanstack/react-query'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { parseDefaultISO } from '@/util/parseDefaultISO'

/**
 * Returns a mutation to mark a communication item as read.
 */
export function useCommunicationsMarkReadMutation() {
  return useMutation({
    mutationFn: (id: unknown) =>
      api
        .post(`/Communication/PrivateMessages/${id}/Read`, true, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => parseDefaultISO(res.data)),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['communications'],
      }),
  })
}
