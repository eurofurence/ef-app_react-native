// Platform web overrides.

export async function multiGet(keys: readonly string[]): Promise<readonly [string, string | null][]> {
    return keys.map(key => [key, localStorage.getItem(key)])
}

export async function multiSet(keyValuePairs: [string, string][]) {
    for (const args of keyValuePairs)
        localStorage.setItem(...args)
}

export async function get(key: string) {
    return localStorage.getItem(key)
}

export async function set(key: string, value: string) {
    localStorage.setItem(key, value)
}
