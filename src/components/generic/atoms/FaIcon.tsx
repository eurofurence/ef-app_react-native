import FontAwesome5Icon from '@expo/vector-icons/FontAwesome5'

import type { ComponentProps } from 'react'

export type FaIconNames = keyof typeof FontAwesome5Icon.glyphMap

export type FaIconProps = ComponentProps<typeof FontAwesome5Icon> & {
  /**
   * Mark icon as decorative. Decorative icons are hidden from screen readers.
   * Defaults to true when no accessibility props are provided.
   */
  decorative?: boolean
}

export function FaIcon({ decorative, accessibilityLabel, accessibilityRole, accessible, ...rest }: FaIconProps) {
  const isDecorative = decorative ?? (!accessible && !accessibilityLabel && !accessibilityRole)

  if (isDecorative) {
    return <FontAwesome5Icon {...rest} accessible={false} accessibilityElementsHidden={true} importantForAccessibility="no" />
  }

  return <FontAwesome5Icon {...rest} accessible={accessible ?? true} accessibilityLabel={accessibilityLabel} accessibilityRole={accessibilityRole} />
}
