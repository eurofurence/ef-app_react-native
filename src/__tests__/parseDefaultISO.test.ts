import { describe, expect, it } from 'bun:test'
import { parseDefaultISO } from '@/util/parseDefaultISO'

describe('parseDefaultISO', () => {
  it('should assume Zulu default', () => {
    const actual = parseDefaultISO('2025-09-03T20:00:00.000')
    const reference = new Date('2025-09-03T20:00:00.000Z')
    expect(actual).toEqual(reference)
  })

  it('should understand Zulu as specified', () => {
    const actual = parseDefaultISO('2025-09-03T20:00:00.000Z')
    const reference = new Date('2025-09-03T20:00:00.000Z')
    expect(actual).toEqual(reference)
  })

  it('should not assume zulu when positive timezone specified', () => {
    const actual = parseDefaultISO('2025-09-03T20:00:00.000+02:00')
    const reference1 = new Date('2025-09-03T20:00:00.000Z')
    const reference2 = new Date('2025-09-03T20:00:00.0000+02:00')
    expect(actual).not.toEqual(reference1)
    expect(actual).toEqual(reference2)
  })

  it('should not assume zulu when negative timezone specified', () => {
    const actual = parseDefaultISO('2025-09-03T20:00:00.000-02:00')
    const reference1 = new Date('2025-09-03T20:00:00.000Z')
    const reference2 = new Date('2025-09-03T20:00:00.0000-02:00')
    expect(actual).not.toEqual(reference1)
    expect(actual).toEqual(reference2)
  })
})
