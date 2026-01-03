import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { render, waitFor } from '@testing-library/react-native'

import AnnounceItem from '@/app/announcements/[id]'
import type { useCache } from '@/context/data/Cache'

// Mock expo-router
mock.module('expo-router', () => ({
  useLocalSearchParams: mock(() => ({ id: 'test-announcement-id' })),
}))

// Mock expo-router
mock.module('react-native-safe-area-context', () => ({
  useSafeAreaInsets: mock(() => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })),
}))

// Mock the cache context
mock.module('@/context/data/Cache', () => ({
  useCache: mock(),
}))

// Mock translation
mock.module('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock date-fns
mock.module('date-fns', () => ({
  format: mock(() => 'Jan 1, 2022, 12:00 AM'),
}))

// Mock date-fns
mock.module('@/util/parseDefaultISO', () => ({
  parseDefaultISO: mock(() => new Date('2022-01-01T00:00:00Z')),
}))

// Mock ToastContext
mock.module('@/context/ui/ToastContext', () => ({
  useToastContext: () => ({
    showToast: mock(),
    hideToast: mock(),
  }),
  useToastMessages: () => [],
}))

const mockUseCache = mock() as ReturnType<typeof mock> & typeof useCache

// Helper function to create mock cache with announcements
const createMockCache = (announcements: Record<string, any> = {}) =>
  ({
    data: {},
    getValue: mock((key: string) =>
      key === 'settings' ? { theme: 'light' } : {}
    ),
    setValue: mock(),
    removeValue: mock(),
    clear: mock(),
    isSynchronizing: false,
    synchronize: mock(),
    announcements: { dict: announcements },
    dealers: { dict: {} },
    images: { dict: {} },
    events: { dict: {} },
    eventDays: { dict: {} },
    eventRooms: { dict: {} },
    eventTracks: { dict: {} },
    knowledgeGroups: { dict: {} },
    knowledgeEntries: { dict: {} },
    maps: { dict: {} },
    eventsFavorite: { dict: {} },
    eventsByDay: {},
    dealersFavorite: { dict: {} },
    dealersInAfterDark: { dict: {} },
    dealersInRegular: { dict: {} },
    searchEvents: {} as any,
    searchEventsFavorite: {} as any,
    searchEventsByDay: {},
    searchDealers: {} as any,
    searchDealersFavorite: {} as any,
    searchDealersInAfterDark: {} as any,
    searchDealersInRegular: {} as any,
    searchKnowledgeEntries: {} as any,
    searchAnnouncements: {} as any,
    searchGlobal: {} as any,
    imageLocations: {},
    eventHosts: [],
    eventsByHost: {},
  }) as any

describe('AnnounceItem', () => {
  beforeEach(() => {
    mockUseCache.mockClear()
    mockUseCache.mockReturnValue(createMockCache())
  })

  test('should render announcement when it exists', async () => {
    const mockAnnouncement = {
      Id: 'test-announcement-id',
      NormalizedTitle: 'Test Announcement',
      Content: 'This is a test announcement',
      ValidFromDateTimeUtc: '2022-01-01T00:00:00Z',
      Area: 'Test Area',
      Author: 'Test Author',
      Image: null,
    }

    mockUseCache.mockReturnValue(
      createMockCache({
        'test-announcement-id': mockAnnouncement,
      })
    )

    const { getByText } = render(<AnnounceItem />)

    await waitFor(() => {
      expect(getByText('Test Announcement')).toBeTruthy()
      expect(getByText('This is a test announcement')).toBeTruthy()
    })
  })

  test('should render message when announcement does not exist', async () => {
    const { getByText, queryByText } = render(<AnnounceItem />)

    await waitFor(() => {
      expect(getByText('not_available')).toBeTruthy()
      expect(queryByText('Test Announcement')).toBeNull()
    })
  })

  test('should handle announcements with images', async () => {
    const announcementWithImage = {
      Id: 'test-announcement-id',
      NormalizedTitle: 'Announcement with Image',
      Content: 'This announcement has an image',
      ValidFromDateTimeUtc: '2022-01-01T00:00:00Z',
      Area: 'Test Area',
      Author: 'Test Author',
      Image: 'test-image-url',
    }

    mockUseCache.mockReturnValue(
      createMockCache({
        'test-announcement-id': announcementWithImage,
      })
    )

    const { getByText } = render(<AnnounceItem />)

    await waitFor(() => {
      expect(getByText('Announcement with Image')).toBeTruthy()
      expect(getByText('This announcement has an image')).toBeTruthy()
    })
  })

  test('should display formatted date and author information', async () => {
    const mockAnnouncement = {
      Id: 'test-announcement-id',
      NormalizedTitle: 'Test Announcement',
      Content: 'Test content',
      ValidFromDateTimeUtc: '2022-01-01T00:00:00Z',
      Area: 'Test Area',
      Author: 'Test Author',
      Image: null,
    }

    mockUseCache.mockReturnValue(
      createMockCache({
        'test-announcement-id': mockAnnouncement,
      })
    )

    const { getByText } = render(<AnnounceItem />)

    await waitFor(() => {
      expect(getByText('Jan 1, 2022, 12:00 AM')).toBeTruthy()
      expect(getByText('Test Area - Test Author')).toBeTruthy()
    })
  })
})
