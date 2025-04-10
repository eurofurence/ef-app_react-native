import { FC } from 'react'

import { FaSection, FaSectionProps } from '../generic/atoms/FaSection'

export type KbSectionProps = FaSectionProps;

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

export const KbSection: FC<KbSectionProps> = ({ style, title, subtitle, icon }) => {
    return <FaSection style={style} title={title} subtitle={subtitle} icon={icon} />
}
