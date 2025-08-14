import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from '@/context/auth/Auth'
import { postPushNotificationsFcmRegistration } from '@/hooks/api/push/usePushNotificationsFcmRegistrationMutation'
import { captureNotificationException } from '@/sentryHelpers'

/**
 * Makes sure we can request a token. We must be on a device and have permissions. If
 * permissions are not given and can be asked for, try to get permission.
 */
const prepareDevicePushTokenPermissions = async () => {
  // Not a device, useless.
  if (!Device.isDevice) return false

  // Permission either given or cannot be asked for again, return here with appropriate status.
  const initial = await Notifications.getPermissionsAsync()
  if (initial.granted) return true
  if (!initial.canAskAgain) return false

  // Request again. Return if granted now.
  const request = await Notifications.requestPermissionsAsync()
  return request.granted
}

/**
 * Retrieves the appropriate device token.
 */
export const getDevicePushToken = async () => {
  // Get the *device* token. We are using native FCM, therefore we need the device token.
  const response = await Notifications.getDevicePushTokenAsync()
  return response.data
}

/**
 * Manages the foreground part of notification handling, as well as handling sync requests
 * originating from a background notification.
 * @constructor
 */
export const useTokenManager = () => {
  // Use login state to trigger.
  const { accessToken } = useAuthContext()

  // Connect device itself via it's token to the backend and the topics. This
  // effect specifies token as a dependency, as a change of the token results
  // in different behavior of the remote method.
  useEffect(() => {
    ;(async () => {
      if (!accessToken) return

      // Prepare it. If not available, do not continue.
      const ok = await prepareDevicePushTokenPermissions()
      if (!ok) return false

      // Acquire the proper token.
      const token = await getDevicePushToken()

      // Register token as a device with all topics.
      await postPushNotificationsFcmRegistration(accessToken, {
        deviceId: token,
        deviceType: Platform.OS,
      })

      // Return actionable true.
      return true
    })().catch((e) => captureNotificationException('Could not register and subscribe', e))
  }, [accessToken])

  return null
}
