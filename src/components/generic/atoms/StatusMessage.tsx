import type React from 'react'
import { Text, View } from 'react-native'

import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

export type StatusMessageProps = {
  /**
   * The message to display
   */
  message: string

  /**
   * The type of live region
   * - polite: Announces when user is idle
   * - assertive: Interrupts user immediately
   * - off: No announcements
   */
  type?: 'polite' | 'assertive' | 'off'

  /**
   * Whether to show the message visually (default: false)
   */
  visible?: boolean
}

/**
 * Component for announcing dynamic content changes to screen readers
 * Uses accessibilityLiveRegion to announce messages to users
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  type = 'polite',
  visible = false,
}) => {
  const textColor = useThemeColorValue('text')

  if (!message) {
    return null
  }

  // Map 'off' to undefined for accessibilityLiveRegion
  const liveRegion = type === 'off' ? undefined : type

  return (
    <View
      accessibilityLiveRegion={liveRegion}
      importantForAccessibility={type !== 'off' ? 'yes' : 'no'}
      accessible={type !== 'off'}
    >
      {visible && (
        <Text style={{ color: textColor, fontSize: 14 }}>{message}</Text>
      )}
    </View>
  )
}
