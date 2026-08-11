import { describe, expect, it } from 'bun:test'
import { compareVersions } from '@/util/compareVersions'

describe('compareVersions', () => {
  it('orders by the first differing segment', () => {
    expect(compareVersions('7.1.1', '7.1.0')).toBeGreaterThan(0)
    expect(compareVersions('7.1.0', '7.1.1')).toBeLessThan(0)
    expect(compareVersions('7.2.0', '7.10.0')).toBeLessThan(0)
    expect(compareVersions('8.0.0', '7.99.99')).toBeGreaterThan(0)
  })

  it('treats missing segments as zero', () => {
    expect(compareVersions('7.1', '7.1.0')).toBe(0)
    expect(compareVersions('7.1.1', '7.1')).toBeGreaterThan(0)
  })

  it('ignores non-numeric suffixes', () => {
    expect(compareVersions('7.1.0-beta', '7.1.0')).toBe(0)
    expect(compareVersions('7.2.0-beta', '7.1.0')).toBeGreaterThan(0)
  })
})
