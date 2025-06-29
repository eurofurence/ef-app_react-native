import { useAuthContext } from '@/context/auth/Auth'
import { useMutation } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'
import { PlatformOSType } from 'react-native'

/**
 * Device registration.
 */
export type PushNotificationsFcmRegistrationData = {
  deviceId: string
  deviceType: PlatformOSType
}

/**
 * Posts device registration data to the API with the given access token, registration data, and optionally an abort signal.
 * @param accessToken The access token.
 * @param data The registration data.
 * @param signal An abort signal.
 */
export async function postPushNotificationsFcmRegistration(accessToken: string | null, data: PushNotificationsFcmRegistrationData, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .post(`${apiBase}/PushNotifications/FcmDeviceRegistration`, data, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.status === 204)
}

/**
 * Uses a mutation for `postPushNotificationsFcmRegistration` with the app auth state.
 */
export function usePushNotificationsFcmRegistrationMutation() {
  const { accessToken } = useAuthContext()
  return useMutation({
    mutationFn: (data: PushNotificationsFcmRegistrationData) => postPushNotificationsFcmRegistration(accessToken, data),
  })
}
