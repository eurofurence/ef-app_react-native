function defaultReplacer(key: string, value: any) {
  return key !== 'dict' ? value : undefined
}

/**
 * JSON stringify with special case handling for "undefined".
 * @param value The value to serialize.
 */
export function stringifyEntityStore(value: any) {
  return value === undefined ? 'undefined' : JSON.stringify(value, defaultReplacer)
}

/**
 * JSON stringify with special case handling for "undefined".
 * @param value The value to serialize.
 */
export function stringifyJsonSafe(value: any) {
  return value === undefined ? 'undefined' : JSON.stringify(value)
}

/**
 * JSON parse with special case handling for "undefined".
 * @param text The value to parse.
 */
export function parseJsonSafe(text: string) {
  return text === 'undefined' ? undefined : JSON.parse(text)
}
