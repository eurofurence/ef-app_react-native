import { FC } from "react";

import { Section, SectionProps } from "../generic/atoms/Section";

export type KbSectionProps = SectionProps;

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
    return <Section style={style} title={title} subtitle={subtitle} icon={icon} />;
};
