import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Gets many keys from the storage.
 * @param keys The keys to get from the storage.
 */
export async function multiGet(keys: readonly string[]): Promise<readonly [string, string | null][]> {
    return await AsyncStorage.multiGet(keys)
}

/**
 * Sets many key-value pairs in the storage.
 * @param keyValuePairs The key-value pairs to write.
 */
export async function multiSet(keyValuePairs: [string, string][]) {
    await AsyncStorage.multiSet(keyValuePairs)
}

/**
 * Gets a value by key from the storage.
 * @param key The key to get from the storage.
 */
export async function get(key: string) {
    return await AsyncStorage.getItem(key)
}

/**
 * Sets a value by key in the storage.
 * @param key The key to write to.
 * @param value The value to write.
 */
export async function set(key: string, value: string) {
    await AsyncStorage.setItem(key, value)
}
