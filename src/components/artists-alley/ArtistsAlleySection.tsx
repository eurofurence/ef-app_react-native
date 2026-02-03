import type { TFunction } from 'i18next'
import type { FC } from 'react'

import type { TableRegistrationRecordStatus } from '@/context/data/types.api'

import type { IconNames } from '../generic/atoms/Icon'
import { Section, type SectionProps } from '../generic/atoms/Section'

export type ArtistsAlleySectionProps = SectionProps

/**
 * Creates the properties for a "state" section.
 * @param t Translation function.
 * @param state Registration state.
 */
export function artistsAlleySectionForState(
  t: TFunction,
  state: TableRegistrationRecordStatus
): ArtistsAlleySectionProps {
  return {
    title: t(state),
    icon: ((state === 'Pending' && 'notebook-edit') ||
      (state === 'Accepted' && 'notebook-check') ||
      (state === 'Published' && 'notebook') ||
      (state === 'Rejected' && 'notebook-remove') ||
      'notebook') as IconNames,
  }
}

export const ArtistsAlleySection: FC<ArtistsAlleySectionProps> = ({
  style,
  title,
  subtitle,
  icon,
}) => {
  return (
    <Section
      style={style}
      title={title}
      subtitle={subtitle}
      backgroundColor='surface'
      icon={icon}
    />
  )
}
