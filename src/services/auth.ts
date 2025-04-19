import { useCallback, useState } from 'react'
import { apiBase } from '@/configuration'
import { getAccessToken } from '@/context/auth/Auth'

type NewPrivateMessage = {
  RecipientUid: string
  AuthorName: string
  ToastTitle: string
  ToastMessage: string
  Subject: string
  Message: string
}

type DeviceRegistration = {
  DeviceId: string
  DeviceType: string
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken()
  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${apiBase}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export const authService = {
  /**
   * Register a device for push notifications
   */
  async registerDevice(registration: DeviceRegistration): Promise<void> {
    await fetchWithAuth('/PushNotifications/FcmDeviceRegistration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registration),
    })
  },

  /**
   * Create a sync request
   */
  async createSyncRequest(): Promise<void> {
    await fetchWithAuth('/PushNotifications/SyncRequest', {
      method: 'POST',
    })
  },

  /**
   * Send a private message
   */
  async sendPrivateMessage(message: NewPrivateMessage): Promise<string> {
    const response = await fetchWithAuth('/Communication/PrivateMessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    return response as string
  },
} as const

// Custom hooks for each service method
export function useRegisterDevice(registration: DeviceRegistration) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await authService.registerDevice(registration)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [registration])

  return { execute, isLoading, error }
}

export function useCreateSyncRequest() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await authService.createSyncRequest()
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { execute, isLoading, error }
}

export function useSendPrivateMessage(message: NewPrivateMessage) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      return await authService.sendPrivateMessage(message)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [message])

  return { execute, isLoading, error }
}
