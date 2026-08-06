// Run standalone: `bun test src/__tests__/cacheSynchronize.test.tsx`. Bun shares
// the module mock registry across files, and nativeIntentWifi.test.ts binds
// '@/configuration' to a narrower shape that the cache graph cannot link against.
import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { act } from 'react'

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

mock.module('@/data/clients/auth', () => ({
  useAuthState: () => ({
    tokenResponse: null,
    idData: null,
    user: null,
    isReady: true,
  }),
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

const ID = 'e7a7aae3-8f7d-4663-8af4-759980f43959'

const emptyChange = {
  RemoveAllBeforeInsert: false,
  DeletedEntities: [],
  ChangedEntities: [],
}

const syncBody = (id = ID) => {
  const data: Record<string, any> = {
    ConventionIdentifier: 'EF30',
    CurrentDateTimeUtc: '2026-08-06T08:00:00.000Z',
    Announcements: {
      RemoveAllBeforeInsert: true,
      DeletedEntities: [],
      ChangedEntities: [
        {
          Id: id,
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

const mountCache = async () => {
  const { createRoot } = await import('react-dom/client')
  const { CacheProvider, useCache } = await import('@/context/data/Cache')

  let cache: any
  const Probe = () => {
    cache = useCache()
    return null
  }

  await act(async () => {
    createRoot(document.createElement('div')).render(
      <CacheProvider>
        <Probe />
      </CacheProvider>
    )
  })

  return () => cache
}

describe('synchronize', () => {
  beforeEach(() => {
    requests.length = 0
  })

  test('an equivalent concurrent call joins the pending run', async () => {
    const cache = await mountCache()

    // The provider's initial sync is already in flight.
    expect(requests.length).toBe(1)

    let joined = false
    await act(async () => {
      cache()
        .synchronize()
        .then(() => {
          joined = true
        })
    })

    expect(requests.length).toBe(1)
    expect(requests[0].aborted).toBe(false)

    await act(async () => {
      requests[0].resolve(syncBody())
    })

    expect(joined).toBe(true)
    expect(cache().announcements.dict[ID]).toBeDefined()
  })

  test('a superseded run rejects rather than resolving without its data', async () => {
    const cache = await mountCache()
    const { SyncSupersededError } = await import('@/context/data/Cache')

    // Settle the initial sync so the next call is a delta and can be superseded.
    await act(async () => {
      requests[0].resolve(syncBody())
    })

    let error: unknown
    let superseded!: Promise<unknown>
    await act(async () => {
      superseded = cache()
        .synchronize()
        .catch((caught: unknown) => {
          error = caught
        })
    })
    expect(requests.length).toBe(2)

    const later = 'ffffffff-0000-0000-0000-000000000000'
    await act(async () => {
      // Its response arrives, but a full sync supersedes it before it applies.
      requests[1].resolve(syncBody(later))
      cache()
        .synchronize({ full: true })
        .catch(() => {})
      await superseded
    })

    expect(error).toBeInstanceOf(SyncSupersededError)
    expect(cache().announcements.dict[later]).toBeUndefined()
  })
})
