/**
 * Compares dot separated version strings, returning a negative number if left
 * precedes right, zero if they are equal and a positive number otherwise.
 * Segments are compared numerically and missing segments count as zero, so
 * `7.1` and `7.1.0` are equal. Anything non-numeric in a segment is ignored,
 * which makes a pre-release suffix rank the same as its release.
 */
export function compareVersions(left: string, right: string): number {
  const leftParts = parseVersion(left)
  const rightParts = parseVersion(right)
  const length = Math.max(leftParts.length, rightParts.length)

  for (let index = 0; index < length; index++) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0)
    if (difference !== 0) return difference
  }
  return 0
}

function parseVersion(version: string): number[] {
  return version
    .trim()
    .split('.')
    .map((segment) => {
      const parsed = Number.parseInt(segment, 10)
      return Number.isNaN(parsed) ? 0 : parsed
    })
}
