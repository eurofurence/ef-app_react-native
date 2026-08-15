import { describe, expect, it } from 'bun:test'

const { redirectSystemPath } = await import('@/app/+native-intent')

describe('redirectSystemPath (wifi)', () => {
  it('maps the onsite /connect link to /wifi with id/pw', () => {
    expect(
      redirectSystemPath({
        path: 'https://wifi.onsite.eurofurence.org/connect?id=a&pw=b',
      })
    ).toBe('/wifi?id=a&pw=b')
  })
  it('maps eurofurence://wifi links to /wifi', () => {
    expect(redirectSystemPath({ path: 'eurofurence://wifi?id=a&pw=b' })).toBe(
      '/wifi?id=a&pw=b'
    )
  })
  it('maps an onsite link without a query to /wifi', () => {
    expect(
      redirectSystemPath({
        path: 'https://wifi.onsite.eurofurence.org/connect',
      })
    ).toBe('/wifi')
  })
  it('leaves unrelated paths unchanged', () => {
    expect(redirectSystemPath({ path: '/settings' })).toBe('/settings')
  })
})
