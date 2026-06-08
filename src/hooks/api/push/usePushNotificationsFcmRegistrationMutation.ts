import { useMutation } from '@tanstack/react-query'
import type { PlatformOSType } from 'react-native'
import { api } from '@/data/clients/api'

/**
 * Device registration.
 */
export type PushNotificationsFcmRegistrationData = {
  deviceId: string
  deviceType: PlatformOSType
}

/**
 * Returns a mutation to register the device with push notifications.
 */
export function usePushNotificationsFcmRegistrationMutation() {
  return useMutation({
    mutationFn: (data: PushNotificationsFcmRegistrationData) =>
      api
        .post(`/PushNotifications/FcmDeviceRegistration`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.status === 204),
  })
}
