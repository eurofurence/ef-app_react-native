import { Vibration } from 'react-native'

/**
 * True if value is a promise (for purposes of this file).
 * @param value The value to test.
 */
function isPromise(value: any): value is Promise<any> {
  return value && value.finally && typeof value.finally === 'function'
}

/**
 * Vibration pattern. See React Native Vibration class.
 */
export type VibrationPattern = number | number[]

/**
 * Vibrate after a value was computed or an operation was completed.
 */
export function vibrateAfter<T>(result: T, pattern?: VibrationPattern): T
export function vibrateAfter<T>(result: Promise<T>, pattern?: VibrationPattern): Promise<T>
export function vibrateAfter<T>(result: Promise<T> | T, pattern?: VibrationPattern): Promise<T> | T {
  if (isPromise(result)) {
    // Wrap promise by attaching a "finally" block.
    return (result as Promise<T>).finally(() => Vibration.vibrate(pattern ?? 400))
  } else {
    // The Result was "already awaited".
    Vibration.vibrate(pattern ?? 400)
    return result
  }
}
