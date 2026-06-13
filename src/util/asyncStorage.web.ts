// Platform web overrides.

/**
 * Gets all keys.
 */
export async function getAllKeys() {
  const result: string[] = []
  for (let i = 0; ; i++) {
    const key = localStorage.key(i)
    if (key === null) return result
    result.push(key)
  }
}

export async function multiGet(
  keys: readonly string[]
): Promise<readonly [string, string | null][]> {
  return keys.map((key) => [key, localStorage.getItem(key)])
}

export async function multiSet(keyValuePairs: [string, string][]) {
  for (const args of keyValuePairs) localStorage.setItem(...args)
}

export async function get(key: string) {
  return localStorage.getItem(key)
}

export async function set(key: string, value: string) {
  localStorage.setItem(key, value)
}

export async function remove(key: string) {
  return localStorage.removeItem(key)
}
