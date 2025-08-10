import MaterialCommunityIcon from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps } from 'react'
import { Platform } from 'react-native'

export type IconNames = keyof typeof MaterialCommunityIcon.glyphMap
export type IconProps = ComponentProps<typeof MaterialCommunityIcon> & {
  /**
   * Mark icon as decorative. Decorative icons are hidden from screen readers.
   * Defaults to true when no accessibility props are provided.
   */
  decorative?: boolean
}

export function Icon({ decorative, accessibilityLabel, accessibilityRole, accessible, ...rest }: IconProps) {
  const isDecorative = decorative ?? (!accessible && !accessibilityLabel && !accessibilityRole)

  if (isDecorative) {
    return <MaterialCommunityIcon {...rest} accessible={false} accessibilityElementsHidden={true} importantForAccessibility="no" />
  }

  return <MaterialCommunityIcon {...rest} accessible={accessible ?? true} accessibilityLabel={accessibilityLabel} accessibilityRole={accessibilityRole} />
}

export const platformShareIcon: IconNames = Platform.OS === 'ios' ? 'export-variant' : 'share'
