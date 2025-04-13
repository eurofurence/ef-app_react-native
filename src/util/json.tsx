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
