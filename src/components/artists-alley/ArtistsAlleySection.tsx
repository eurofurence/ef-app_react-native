import { TFunction } from 'i18next'
import { FC } from 'react'

import { TableRegistrationRecordStatus } from '@/context/data/types.api'

import { IconNames } from '../generic/atoms/Icon'
import { Section, SectionProps } from '../generic/atoms/Section'

export type ArtistsAlleySectionProps = SectionProps

/**
 * Creates the properties for a "state" section.
 * @param t Translation function.
 * @param state Registration state.
 */
export function artistsAlleySectionForState(t: TFunction, state: TableRegistrationRecordStatus): ArtistsAlleySectionProps {
  return {
    title: t(state),
    icon: ((state === 'Pending' && 'notebook-edit') ||
      (state === 'Accepted' && 'notebook-check') ||
      (state === 'Published' && 'notebook') ||
      (state === 'Rejected' && 'notebook-remove') ||
      'notebook') as IconNames,
  }
}

export const ArtistsAlleySection: FC<ArtistsAlleySectionProps> = ({ style, title, subtitle, icon }) => {
  return <Section style={style} title={title} subtitle={subtitle} backgroundColor="surface" icon={icon} />
}
