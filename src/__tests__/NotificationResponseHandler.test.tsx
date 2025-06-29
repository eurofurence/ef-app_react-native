import { jest } from '@jest/globals'

// Mock expo-notifications
const mockAddNotificationResponseReceivedListener = jest.fn()
const mockRouter = {
  navigate: jest.fn(),
}

jest.mock('expo-notifications', () => ({
  addNotificationResponseReceivedListener: mockAddNotificationResponseReceivedListener,
}))

jest.mock('expo-router', () => ({
  router: mockRouter,
}))

jest.mock('@/sentryHelpers', () => ({
  captureNotificationException: jest.fn(),
}))

describe('NotificationResponseHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('should register notification response listener on import', async () => {
    // Import the module to trigger the setup
    await import('@/init/setNotificationResponseHandler')

    expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1)
    expect(typeof mockAddNotificationResponseReceivedListener.mock.calls[0][0]).toBe('function')
  })

  it('should navigate to announcement when notification contains announcement ID', async () => {
    // Import the module and get the listener function
    await import('@/init/setNotificationResponseHandler')
    const listenerFunction = mockAddNotificationResponseReceivedListener.mock.calls[0][0]

    const mockResponse = {
      notification: {
        request: {
          content: {
            categoryIdentifier: 'announcements',
            data: {
              id: 'test-announcement-123',
            },
          },
        },
      },
    }

    listenerFunction(mockResponse)

    expect(mockRouter.navigate).toHaveBeenCalledWith({
      pathname: '/announcements/[id]',
      params: { id: 'test-announcement-123' },
    })
  })

  it('should handle different announcement ID field names', async () => {
    await import('@/init/setNotificationResponseHandler')
    const listenerFunction = mockAddNotificationResponseReceivedListener.mock.calls[0][0]

    const mockResponse = {
      notification: {
        request: {
          content: {
            data: {
              type: 'announcement',
              announcementId: 'test-announcement-456',
            },
          },
        },
      },
    }

    listenerFunction(mockResponse)

    expect(mockRouter.navigate).toHaveBeenCalledWith({
      pathname: '/announcements/[id]',
      params: { id: 'test-announcement-456' },
    })
  })

  it('should not navigate when announcement ID is missing', async () => {
    await import('@/init/setNotificationResponseHandler')
    const listenerFunction = mockAddNotificationResponseReceivedListener.mock.calls[0][0]

    const mockResponse = {
      notification: {
        request: {
          content: {
            categoryIdentifier: 'announcements',
            data: {},
          },
        },
      },
    }

    listenerFunction(mockResponse)

    expect(mockRouter.navigate).not.toHaveBeenCalled()
  })

  it('should not navigate for non-announcement notifications', async () => {
    await import('@/init/setNotificationResponseHandler')
    const listenerFunction = mockAddNotificationResponseReceivedListener.mock.calls[0][0]

    const mockResponse = {
      notification: {
        request: {
          content: {
            categoryIdentifier: 'event_reminders',
            data: {
              id: 'some-event-id',
            },
          },
        },
      },
    }

    listenerFunction(mockResponse)

    expect(mockRouter.navigate).not.toHaveBeenCalled()
  })
})
