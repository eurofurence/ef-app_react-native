import { useEffect, useRef } from 'react'
import { AccessibilityInfo, findNodeHandle, Platform } from 'react-native'

/**
 * Hook to automatically focus an element for screen readers when it mounts
 * @param delay Optional delay in milliseconds before focusing
 */
export const useAccessibilityFocus = <T extends React.Component>(delay?: number) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (Platform.OS === 'web') return
    if (ref.current) {
      const timeoutId = setTimeout(() => {
        const nodeHandle = findNodeHandle(ref.current)
        if (nodeHandle) {
          AccessibilityInfo.setAccessibilityFocus(nodeHandle)
        }
      }, delay || 100)

      return () => clearTimeout(timeoutId)
    }
  }, [delay])

  return ref
}

/**
 * Function to announce messages to screen readers
 * @param message The message to announce
 * @param interrupt Whether to interrupt current announcements (assertive) or wait (polite)
 */
export const announceForAccessibility = (message: string, interrupt: boolean = false) => {
  if (message) {
    AccessibilityInfo.announceForAccessibility(message)
  }
}

/**
 * Hook to announce a message when a condition changes
 * @param message The message to announce
 * @param condition The condition to watch for changes
 * @param interrupt Whether to interrupt current announcements (assertive) or wait (polite)
 */
export const useAccessibilityAnnouncement = (message: string, condition: any, interrupt: boolean = false) => {
  useEffect(() => {
    if (message) {
      announceForAccessibility(message, interrupt)
    }
  }, [message, condition, interrupt])
}
