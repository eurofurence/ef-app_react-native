/**
 * Converts Hue/Saturation/Value to CSS RGB hex string.
 */
export function colorFromHsv(h: number, s: number, v: number) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return Math.floor((v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)) * 255.0)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(5)}${f(3)}${f(1)}`
}
