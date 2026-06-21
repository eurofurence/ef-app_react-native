import { beforeAll, describe, expect, mock, test } from 'bun:test'

mock.module('react-native', () => ({}))
mock.module('@sentry/react-native', () => ({ captureException: mock() }))
mock.module('@/data/clients/api', () => ({ api: {} }))
mock.module('@/data/collections/FavoriteEvents', () => ({
  favoriteEventsCollection: {},
}))

let computeFavoriteSync: (
  localIds: readonly string[],
  remoteIds: readonly string[]
) => { pushed: string[]; pulled: string[] }

beforeAll(async () => {
  const m = await import('@/data/clients/favoritesSync')
  computeFavoriteSync = m.computeFavoriteSync
})

describe('computeFavoriteSync', () => {
  test('pushes local-only ids and pulls remote-only ids (union)', () => {
    const result = computeFavoriteSync(['a', 'b'], ['b', 'c'])
    expect(result.pushed).toEqual(['a'])
    expect(result.pulled).toEqual(['c'])
  })

  test('no changes when sets are equal', () => {
    const result = computeFavoriteSync(['a', 'b'], ['b', 'a'])
    expect(result.pushed).toEqual([])
    expect(result.pulled).toEqual([])
  })

  test('empty remote pushes everything local', () => {
    const result = computeFavoriteSync(['a', 'b'], [])
    expect(result.pushed).toEqual(['a', 'b'])
    expect(result.pulled).toEqual([])
  })

  test('empty local pulls everything remote', () => {
    const result = computeFavoriteSync([], ['x', 'y'])
    expect(result.pushed).toEqual([])
    expect(result.pulled).toEqual(['x', 'y'])
  })
})
