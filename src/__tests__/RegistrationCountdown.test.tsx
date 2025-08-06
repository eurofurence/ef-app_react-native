import { RegistrationCountdown } from '@/components/home/RegistrationCountdown'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { useCache } from '@/context/data/Cache'
import { useRegistrationDatesQuery } from '@/hooks/api/registration/useRegistrationDatesQuery'
import { useWarningState } from '@/hooks/data/useWarningState'
import { useNow } from '@/hooks/time/useNow'

// Mock expo-router
jest.mock('@react-navigation/core', () => ({
  useIsFocused: jest.fn(() => true),
}))

// Mock the cache context
jest.mock('@/context/data/Cache', () => ({
  useCache: jest.fn(),
}))

// Mock the registration dates query
jest.mock('@/hooks/api/registration/useRegistrationDatesQuery', () => ({
  useRegistrationDatesQuery: jest.fn(),
}))

// Mock warning state
jest.mock('@/hooks/data/useWarningState', () => ({
  useWarningState: jest.fn(),
}))

// Mock useNow
jest.mock('@/hooks/time/useNow', () => ({
  useNow: jest.fn(),
}))

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        registration_title: 'Registration',
        register_now: 'Register Now',
        thank_you_see_you_next_year: 'Thank you! See you next year!',
        registration_opens_in: 'Registration opens in {diff}',
        registration_open: 'Registration is now open!',
        registration_closed: 'Registration has closed',
        hide: 'Hide',
      }
      return translations[key] || key
    },
  }),
}))

// Mock react-native Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}))

// Mock theme hooks
jest.mock('@/hooks/themes/useThemeHooks', () => ({
  useThemeColorValue: jest.fn(() => '#ff0000'),
  useThemeColor: jest.fn(() => ({ color: '#000000' })),
  useThemeBorder: jest.fn(() => ({ borderColor: '#cccccc' })),
  useThemeBackground: jest.fn(() => ({ backgroundColor: '#ffffff' })),
}))

const mockUseCache = useCache as jest.MockedFunction<typeof useCache>
const mockUseRegistrationDatesQuery = useRegistrationDatesQuery as jest.MockedFunction<typeof useRegistrationDatesQuery>
const mockUseWarningState = useWarningState as jest.MockedFunction<typeof useWarningState>
const mockUseNow = useNow as jest.MockedFunction<typeof useNow>

// Helper function to create mock cache
const createMockCache = (eventDays: any[] = []) =>
  ({
    eventDays,
    data: {},
    getValue: jest.fn(),
    setValue: jest.fn(),
    removeValue: jest.fn(),
    clear: jest.fn(),
    isSynchronizing: false,
    synchronize: jest.fn(),
    announcements: { dict: {} },
    dealers: { dict: {} },
    images: { dict: {} },
    events: { dict: {} },
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

describe('RegistrationCountdown', () => {
  const mockNow = new Date('2024-01-15T12:00:00Z')
  const mockStartDate = new Date('2024-02-01T00:00:00Z')
  const mockEndDate = new Date('2024-03-01T00:00:00Z')

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseNow.mockReturnValue(mockNow)
    mockUseWarningState.mockReturnValue({
      isHidden: false,
      hideWarning: jest.fn(),
      showWarning: jest.fn(),
    })
    mockUseCache.mockReturnValue(createMockCache())
  })

  describe('when registration is open', () => {
    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: {
          startDate: mockStartDate,
          endDate: mockEndDate,
        },
        isLoading: false,
        error: null,
      } as any)
      mockUseNow.mockReturnValue(new Date('2024-02-15T12:00:00Z')) // During registration period
    })

    it('should show registration open message and button', () => {
      render(<RegistrationCountdown registrationUrl="https://example.com/register" />)

      expect(screen.getByText('Registration is now open!')).toBeTruthy()
      expect(screen.getByText('Register Now')).toBeTruthy()
    })

    it('should not show button when no registration URL is provided', () => {
      render(<RegistrationCountdown />)

      expect(screen.getByText('Registration is now open!')).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeNull()
    })

    it('should show register button when registration URL is provided', () => {
      render(<RegistrationCountdown registrationUrl="https://example.com/register" />)

      expect(screen.getByText('Register Now')).toBeTruthy()
    })
  })

  describe('when registration has not opened yet', () => {
    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: {
          startDate: mockStartDate,
          endDate: mockEndDate,
        },
        isLoading: false,
        error: null,
      } as any)
      mockUseNow.mockReturnValue(new Date('2024-01-20T12:00:00Z')) // Before registration opens
    })

    it('should show countdown message and no button', () => {
      render(<RegistrationCountdown registrationUrl="https://example.com/register" />)

      expect(screen.getByText(/Registration opens in/)).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeNull()
    })
  })

  describe('when registration has closed', () => {
    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: {
          startDate: mockStartDate,
          endDate: mockEndDate,
        },
        isLoading: false,
        error: null,
      } as any)
      mockUseNow.mockReturnValue(new Date('2024-03-15T12:00:00Z')) // After registration closes
    })

    it('should show closed message and no button', () => {
      render(<RegistrationCountdown registrationUrl="https://example.com/register" />)

      expect(screen.getByText('Registration has closed')).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeNull()
    })
  })

  describe('when showing thank you message', () => {
    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: {
          startDate: new Date('2024-06-01T00:00:00Z'), // Next year's registration
          endDate: new Date('2024-07-01T00:00:00Z'),
        },
        isLoading: false,
        error: null,
      } as any)
      mockUseNow.mockReturnValue(new Date('2024-04-15T12:00:00Z')) // After convention, before next registration
      mockUseCache.mockReturnValue(
        createMockCache([
          { Date: '2024-04-10T00:00:00Z' }, // Convention ended
        ])
      )
    })

    it('should show thank you message and no button', () => {
      render(<RegistrationCountdown registrationUrl="https://example.com/register" />)

      expect(screen.getByText('Thank you! See you next year!')).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeNull()
    })
  })

  describe('when loading', () => {
    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      } as any)
    })

    it('should not render anything', () => {
      const { toJSON } = render(<RegistrationCountdown registrationUrl="https://example.com/register" />)
      expect(toJSON()).toBeNull()
    })
  })

  describe('when there is an error', () => {
    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load registration dates'),
      } as any)
    })

    it('should not render anything', () => {
      const { toJSON } = render(<RegistrationCountdown registrationUrl="https://example.com/register" />)
      expect(toJSON()).toBeNull()
    })
  })

  describe('when warning is hidden', () => {
    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: {
          startDate: mockStartDate,
          endDate: mockEndDate,
        },
        isLoading: false,
        error: null,
      } as any)
      mockUseNow.mockReturnValue(new Date('2024-02-15T12:00:00Z'))
      mockUseWarningState.mockReturnValue({
        isHidden: true,
        hideWarning: jest.fn(),
        showWarning: jest.fn(),
      })
    })

    it('should not render anything', () => {
      const { toJSON } = render(<RegistrationCountdown registrationUrl="https://example.com/register" />)
      expect(toJSON()).toBeNull()
    })
  })

  describe('hide warning functionality', () => {
    const mockHideWarning = jest.fn()

    beforeEach(() => {
      mockUseRegistrationDatesQuery.mockReturnValue({
        data: {
          startDate: mockStartDate,
          endDate: mockEndDate,
        },
        isLoading: false,
        error: null,
      } as any)
      mockUseNow.mockReturnValue(new Date('2024-02-15T12:00:00Z'))
      mockUseWarningState.mockReturnValue({
        isHidden: false,
        hideWarning: mockHideWarning,
        showWarning: jest.fn(),
      })
    })

    it('should call hideWarning when hide button is pressed', () => {
      render(<RegistrationCountdown registrationUrl="https://example.com/register" />)

      const hideButton = screen.getByText('Hide')
      fireEvent.press(hideButton)

      expect(mockHideWarning).toHaveBeenCalled()
    })
  })
})
