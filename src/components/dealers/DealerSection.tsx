import { TFunction } from 'i18next'
import { FC } from 'react'

import { IconNames } from '../generic/atoms/Icon'
import { Section, SectionProps } from '../generic/atoms/Section'

export type DealerSectionProps = SectionProps

/**
 * Static category icon mapping.
 */
const categoryIcons: Record<string, IconNames> = {
  Prints: 'printer',
  Artwork: 'image-frame',
  Commissions: 'brush',
  Fursuits: 'scissors-cutting',
  Miscellaneous: 'shape',
  Unknown: 'folder-image',
}

/**
 * Creates the properties for a dealer section.
 * @param category The category.
 */
export function dealerSectionForCategory(category: string): DealerSectionProps {
  return {
    title: category,
    icon: categoryIcons[category] ?? categoryIcons.Unknown,
  }
}

/**
 * Creates the properties for a dealer section.
 * @param t Translation function.
 * @param isAfterDark True if after dark.
 */
export function dealerSectionForLocation(t: TFunction, isAfterDark: boolean): DealerSectionProps {
  return {
    title: isAfterDark ? t('dealers_in_ad') : t('dealers_in_regular'),
    icon: isAfterDark ? 'weather-night' : 'weather-sunny',
  }
}

/**
 * Creates the properties for a dealer section.
 * @param title The title.
 */
export function dealerSectionForLetter(title: string): DealerSectionProps {
  return {
    title,
    icon: 'bookmark' as IconNames,
  }
}

export const DealerSection: FC<DealerSectionProps> = ({ style, title, subtitle, icon }) => {
  return <Section style={style} title={title} subtitle={subtitle} backgroundColor="surface" icon={icon} />
}
