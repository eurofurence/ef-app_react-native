// Run standalone: `bun test src/__tests__/notificationColdStart.test.tsx`. Bun
// shares the module mock registry across files, and nativeIntentWifi.test.ts
// binds '@/configuration' to a narrower shape the cache graph cannot link against.
import { describe, expect, mock, test } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { act, useLayoutEffect, useState } from 'react'

// Required by React 19 before act() may be used.
;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

// react-dom needs a document. Bun runs test files in one process, so the other
// rendering test file may have registered already.
if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

mock.module('react-native', () => ({
  Vibration: { vibrate: () => {} },
  Platform: { OS: 'android', select: (o: any) => o.android ?? o.default },
}))

mock.module('@/util/asyncStorage', () => ({
  multiGet: mock(async (keys: string[]) => keys.map((k) => [k, null])),
  multiSet: mock(async () => undefined),
  set: mock(async () => undefined),
  get: mock(async () => null),
}))

mock.module('@/sentryHelpers', () => ({
  captureNotificationException: mock(),
}))

// Mirrors the real auth client: ready with a restored token first, then whoami
// lands and adds roles, which changes the sync auth key mid-tap.
let notifyAuth: (() => void) | null = null
let authState: any = {
  tokenResponse: { accessToken: 'token' },
  idData: { sub: 'user-1' },
  user: null,
  isReady: true,
}

mock.module('@/data/clients/auth', () => ({
  useAuthState: () => {
    const [, force] = useState(0)
    useLayoutEffect(() => {
      notifyAuth = () => force((n) => n + 1)
      return () => {
        notifyAuth = null
      }
    }, [])
    return authState
  },
}))

const ID = 'e7a7aae3-8f7d-4663-8af4-759980f43959'

// Mirrors expo-notifications: a layout effect supplies the response after mount.
mock.module('expo-notifications', () => ({
  useLastNotificationResponse: () => {
    const [value, setValue] = useState<any>(undefined)
    useLayoutEffect(() => {
      setValue({
        notification: {
          request: {
            identifier: 'n1',
            content: {
              data: { CID: 'EF30', Event: 'Announcement', RelatedId: ID },
            },
          },
        },
      })
    }, [])
    return value
  },
}))

const navigations: any[] = []
mock.module('expo-router', () => ({
  router: { navigate: (target: any) => navigations.push(target) },
}))

mock.module('@/hooks/api/communications/useCommunicationsQuery', () => ({
  useCommunicationsQuery: () => ({ refetch: async () => undefined }),
}))

type Request = { resolve: (value: any) => void; aborted: boolean }
const requests: Request[] = []

mock.module('axios', () => ({
  default: {
    get: mock((_url: string, config: any) => {
      const entry: Request = { resolve: () => {}, aborted: false }
      const promise = new Promise<any>((resolve, reject) => {
        entry.resolve = resolve
        config.signal.addEventListener('abort', () => {
          entry.aborted = true
          reject(new Error('canceled'))
        })
      })
      requests.push(entry)
      return promise
    }),
  },
}))

const emptyChange = {
  RemoveAllBeforeInsert: false,
  DeletedEntities: [],
  ChangedEntities: [],
}

const syncBody = () => {
  const data: Record<string, any> = {
    ConventionIdentifier: 'EF30',
    CurrentDateTimeUtc: '2026-08-06T08:00:00.000Z',
    Announcements: {
      RemoveAllBeforeInsert: true,
      DeletedEntities: [],
      ChangedEntities: [
        {
          Id: ID,
          Title: 'Festival Guide',
          Content: 'Festival Guide',
          Area: 'Announcement',
          Author: 'Efsched',
          ValidFromDateTimeUtc: '2026-08-05T18:15:04.000',
          ValidUntilDateTimeUtc: '2026-08-06T18:14:22.000',
          LastChangeDateTimeUtc: '2026-08-05T18:16:38.858',
        },
      ],
    },
  }
  for (const key of [
    'Events',
    'EventConferenceDays',
    'EventConferenceRooms',
    'EventConferenceTracks',
    'KnowledgeGroups',
    'KnowledgeEntries',
    'Images',
    'Dealers',
    'Maps',
    'TableRegistrations',
    'LostAndFound',
    'Communications',
  ]) {
    data[key] = emptyChange
  }
  return { data }
}

describe('notification cold start', () => {
  test('one tap navigates once and the announcement is in the cache', async () => {
    const { createRoot } = await import('react-dom/client')
    const { CacheProvider, useCache } = await import('@/context/data/Cache')
    const { useNotificationResponseManager } = await import(
      '@/hooks/notifications/useNotificationResponseManager'
    )

    let cache: any
    const Probe = () => {
      cache = useCache()
      useNotificationResponseManager()
      return null
    }

    await act(async () => {
      createRoot(document.createElement('div')).render(
        <CacheProvider>
          <Probe />
        </CacheProvider>
      )
    })

    // The notification joins the provider's run rather than cancelling it.
    expect(requests.length).toBe(1)
    expect(requests[0].aborted).toBe(false)

    // Roles arrive, which legitimately invalidates the pending run.
    await act(async () => {
      authState = { ...authState, user: { Roles: ['Attendee'] } }
      notifyAuth?.()
    })

    await act(async () => {
      for (const request of requests) {
        if (!request.aborted) request.resolve(syncBody())
      }
      await Promise.resolve()
    })

    expect(navigations).toEqual([
      { pathname: '/announcements/[id]', params: { id: ID } },
    ])
    expect(cache.announcements.dict[ID]).toBeDefined()
  })
})
