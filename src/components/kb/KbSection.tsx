import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { FaSection, type FaSectionProps } from '../generic/atoms/FaSection'

export type KbSectionProps = FaSectionProps

// /**
//  * Creates the properties for a dealer section.
//  * @param title The title.
//  */
// export function kbSectionForTitle(title: string): DealerSectionProps {
//     return {
//         title,
//         icon: "folder-image" as IconNames,
//     };
// }

export const KbSection: FC<KbSectionProps> = ({
  style,
  title,
  subtitle,
  icon,
}) => {
  const { t } = useTranslation('KnowledgeGroups')

  return (
    <FaSection
      style={style}
      title={title}
      subtitle={subtitle}
      icon={icon}
      accessibilityRole='header'
      accessibilityLabel={t('accessibility.kb_section_header', {
        title,
        subtitle,
      })}
    />
  )
}
