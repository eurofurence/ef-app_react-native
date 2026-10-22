import type { FC } from 'react'

import { Section, type SectionProps } from '../generic/atoms/Section'

export type EventSectionProps = SectionProps

export const EventSection: FC<EventSectionProps> = ({
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
