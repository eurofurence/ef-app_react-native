import { colorFromHsv } from '@/util/colorFromHsv'

/**
 * Computes a color to display for an announcement area.
 * @param area Area name.
 * @param s Saturation to use.
 * @param v Value to use.
 */
export const colorForArea = (area: string, s: number, v: number) => {
    // Hash, then xor-shift. Use as HSV index.
    let n = 1
    for (let i = 0; i < area.length; i++) n = (n * 7 + area.charCodeAt(i)) % Number.MAX_SAFE_INTEGER
    n += 0x6d2b79f5
    n = Math.imul(n ^ (n >>> 15), n | 1)
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61)
    n = (n ^ (n >>> 14)) >>> 0
    return colorFromHsv((n % (360 / 15)) * 15, s, v)
}
