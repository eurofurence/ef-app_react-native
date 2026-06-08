import { useMutation } from '@tanstack/react-query'
import { api } from '@/data/clients/api'

/**
 * Communication-send data.
 */
export type CommunicationsSendData = {
  type?: 'byRegistrationId' | 'byIdentityId'
  recipientUid: string
  authorName: string
  toastTitle: string
  toastMessage: string
  subject: string
  message: string
}

/**
 * Returns a mutation to send a PM via the API.
 */
export function useCommunicationsSendMutation() {
  return useMutation({
    mutationFn: ({ type, ...message }: CommunicationsSendData) =>
      api
        .post(
          `/Communication/PrivateMessages/:${type ?? 'byRegistrationId'}`,
          message,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => res.data),
    onSuccess: (_data, _variables, _onMutateResult, { client }) =>
      client.invalidateQueries({
        queryKey: ['communications'],
      }),
  })
}
