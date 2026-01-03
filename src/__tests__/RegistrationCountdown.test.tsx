import { beforeEach, describe, expect, it, type Mock, mock } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react-native'

import { RegistrationCountdown } from '@/components/home/RegistrationCountdown'
import { useAuthContext } from '@/context/auth/Auth'
import { useUserContext } from '@/context/auth/User'
import type { useCache } from '@/context/data/Cache'
import { useRegistrationDatesQuery } from '@/hooks/api/registration/useRegistrationDatesQuery'
import { useWarningState } from '@/hooks/data/useWarningState'
import { useNow } from '@/hooks/time/useNow'

// Mock expo-router
mock.module('@react-navigation/core', () => ({
  useIsFocused: mock(() => true),
}))

// Mock @expo/vector-icons to prevent async state updates
mock.module('@expo/vector-icons/MaterialCommunityIcons', () => {
  const MockIcon = () => {
    // Return null to avoid rendering issues, just for testing
    return null
  }
  return {
    __esModule: true,
    default: MockIcon,
  }
})

// Mock the cache context
mock.module('@/context/data/Cache', () => ({
  useCache: mock(),
}))

// Mock the registration dates query
mock.module('@/hooks/api/registration/useRegistrationDatesQuery', () => ({
  useRegistrationDatesQuery: mock(),
}))

// Mock warning state
mock.module('@/hooks/data/useWarningState', () => ({
  useWarningState: mock(),
}))

// Mock useNow
mock.module('@/hooks/time/useNow', () => ({
  useNow: mock(),
}))

// Mock auth context
mock.module('@/context/auth/Auth', () => ({
  useAuthContext: mock(),
}))

// Mock user context
mock.module('@/context/auth/User', () => ({
  useUserContext: mock(),
}))

// Mock translation
mock.module('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        hide: 'Hide',
        login_prompt: 'Log in to get more features!',
        login: 'Login',
        register_now: 'Register Now',
        registration_closed: 'Registration has closed',
        registration_open: 'Registration is now open!',
        registration_opens_in: 'Registration opens in {diff}',
        registration_title: 'Registration',
        thank_you_see_you_next_year: 'Thank you! See you next year!',
      }
      return translations[key] || key
    },
  }),
}))

// Mock react-native Linking
mock.module('react-native/Libraries/Linking/Linking', () => ({
  openURL: mock(),
}))

// Mock theme hooks
mock.module('@/hooks/themes/useThemeHooks', () => ({
  useThemeColorValue: mock(() => '#ff0000'),
  useThemeColor: mock(() => ({ color: '#000000' })),
  useThemeBorder: mock(() => ({ borderColor: '#cccccc' })),
  useThemeBackground: mock(() => ({ backgroundColor: '#ffffff' })),
}))

const mockUseCache = mock() as ReturnType<typeof mock> & typeof useCache
const mockUseRegistrationDatesQuery = useRegistrationDatesQuery as Mock<
  typeof useRegistrationDatesQuery
>
const mockUseWarningState = useWarningState as Mock<typeof useWarningState>
const mockUseNow = useNow as Mock<typeof useNow>
const mockUseAuthContext = useAuthContext as Mock<typeof useAuthContext>
const mockUseUserContext = useUserContext as Mock<typeof useUserContext>

// Helper function to create mock cache
const createMockCache = (eventDays: any[] = []) =>
  ({
    eventDays,
    data: {},
    getValue: mock(),
    setValue: mock(),
    removeValue: mock(),
    clear: mock(),
    isSynchronizing: false,
    synchronize: mock(),
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
    mock.clearAllMocks()
    mockUseNow.mockReturnValue(mockNow)
    mockUseWarningState.mockReturnValue({
      isHidden: false,
      hideWarning: mock(),
      showWarning: mock(),
    })
    mockUseCache.mockReturnValue(createMockCache())
    mockUseAuthContext.mockReturnValue({
      loggedIn: false,
      accessToken: null,
      tokenResponse: null,
      idData: null,
      load: mock(),
      login: mock(),
      refreshToken: mock(),
      logout: mock(),
    })
    mockUseUserContext.mockReturnValue({
      claims: null,
      user: null,
      refresh: mock(() => Promise.resolve()),
    } as any)
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
      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(screen.getByText(/Registration is now open!/)).toBeTruthy()
      expect(screen.getByText('Register Now')).toBeTruthy()
    })

    it('should not show button when no registration URL is provided', () => {
      render(<RegistrationCountdown />)

      expect(screen.getByText(/Registration is now open!/)).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeNull()
    })

    it('should show register button when registration URL is provided', () => {
      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(screen.getByText('Register Now')).toBeTruthy()
    })

    it('should show countdown when user is logged in but not an attendee', () => {
      mockUseAuthContext.mockReturnValue({
        loggedIn: true,
        accessToken: 'token',
        tokenResponse: {} as any,
        idData: { sub: '0' },
        load: mock(),
        login: mock(),
        refreshToken: mock(),
        logout: mock(),
      })
      mockUseUserContext.mockReturnValue({
        claims: { sub: '0' },
        user: { RoleMap: { Attendee: false } },
        refresh: mock(() => Promise.resolve()),
      } as any)

      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(screen.getByText(/Registration is now open!/)).toBeTruthy()
      expect(screen.getByText('Register Now')).toBeTruthy()
    })

    it('should not show countdown when user is logged in and is an attendee', () => {
      mockUseAuthContext.mockReturnValue({
        loggedIn: true,
        accessToken: 'token',
        tokenResponse: {} as any,
        idData: { sub: '0' } as any,
        load: mock(),
        login: mock(),
        refreshToken: mock(),
        logout: mock(),
      })
      mockUseUserContext.mockReturnValue({
        claims: { sub: '0' },
        user: { RoleMap: { Attendee: true } },
        refresh: mock(() => Promise.resolve()),
      } as any)

      const { toJSON } = render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(toJSON()).toBeNull()
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
      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

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
      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(screen.getByText(/Registration has closed/)).toBeTruthy()
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

    it('should show thank you message and no registration button if user is logged in and is an attendee', () => {
      mockUseAuthContext.mockReturnValue({
        loggedIn: true,
        accessToken: 'token',
        tokenResponse: {} as any,
        idData: { sub: '0' },
        load: mock(),
        login: mock(),
        refreshToken: mock(),
        logout: mock(),
      })
      mockUseUserContext.mockReturnValue({
        claims: { sub: '0' },
        user: { RoleMap: { Attendee: true } },
        refresh: mock(() => Promise.resolve()),
      } as any)

      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(screen.getByText(/Thank you! See you next year!/)).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeFalsy()
    })

    it('should show thank you message and no registration button if user is logged in and is not an attendee', () => {
      mockUseAuthContext.mockReturnValue({
        loggedIn: true,
        accessToken: 'token',
        tokenResponse: {} as any,
        idData: { sub: '0' },
        load: mock(),
        login: mock(),
        refreshToken: mock(),
        logout: mock(),
      })
      mockUseUserContext.mockReturnValue({
        claims: { sub: '0' },
        user: { RoleMap: { Attendee: false } },
        refresh: mock(() => Promise.resolve()),
      } as any)

      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(screen.getByText(/Thank you! See you next year!/)).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeFalsy()
    })

    it('should show thank you message and no registration button if user is not logged in', () => {
      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      expect(screen.getByText(/Thank you! See you next year!/)).toBeTruthy()
      expect(screen.queryByText('Register Now')).toBeFalsy()
    })
  })

  describe('when prompting user to log in', () => {
    it('should not show login prompt if user is logged in and is not an attendee', () => {
      mockUseAuthContext.mockReturnValue({
        loggedIn: true,
        accessToken: 'token',
        tokenResponse: {} as any,
        idData: { sub: '0' },
        load: mock(),
        login: mock(),
        refreshToken: mock(),
        logout: mock(),
      })
      mockUseUserContext.mockReturnValue({
        claims: { sub: '0' },
        user: { RoleMap: { Attendee: false } },
        refresh: mock(() => Promise.resolve()),
      } as any)

      render(<RegistrationCountdown />)

      expect(screen.queryByText(/Log in to get more features!/)).toBeFalsy()
      expect(screen.queryByText('Login')).toBeFalsy()
    })

    it('should not show login prompt if user is logged in and is an attendee', () => {
      mockUseAuthContext.mockReturnValue({
        loggedIn: true,
        accessToken: 'token',
        tokenResponse: {} as any,
        idData: { sub: '0' },
        load: mock(),
        login: mock(),
        refreshToken: mock(),
        logout: mock(),
      })
      mockUseUserContext.mockReturnValue({
        claims: { sub: '0' },
        user: { RoleMap: { Attendee: true } },
        refresh: mock(() => Promise.resolve()),
      } as any)

      render(<RegistrationCountdown />)

      expect(screen.queryByText(/Log in to get more features!/)).toBeFalsy()
      expect(screen.queryByText('Login')).toBeFalsy()
    })

    it('should show login prompt if user is not logged in', () => {
      render(<RegistrationCountdown />)

      expect(screen.getByText(/Log in to get more features!/)).toBeTruthy()
      expect(screen.queryByText('Login')).toBeTruthy()
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
      const { toJSON } = render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )
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
      const { toJSON } = render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )
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
        hideWarning: mock(),
        showWarning: mock(),
      })
    })

    it('should not render anything', () => {
      const { toJSON } = render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )
      expect(toJSON()).toBeNull()
    })
  })

  describe('hide warning functionality', () => {
    const mockHideWarning = mock()

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
        showWarning: mock(),
      })
    })

    it('should call hideWarning when hide button is pressed', () => {
      render(
        <RegistrationCountdown registrationUrl='https://example.com/register' />
      )

      const hideButton = screen.getByText('Hide')
      fireEvent.press(hideButton)

      expect(mockHideWarning).toHaveBeenCalled()
    })
  })
})
