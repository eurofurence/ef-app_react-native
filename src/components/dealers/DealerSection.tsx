import { FC } from "react";

import { IconNames } from "../generic/atoms/Icon";
import { Section, SectionProps } from "../generic/atoms/Section";

export type DealerSectionProps = SectionProps;

/**
 * Creates the properties for a dealer section.
 * @param title The title.
 */
export function dealerSectionForTitle(title: string): DealerSectionProps {
    return {
        title,
        icon: "folder-image" as IconNames,
    };
}

export const DealerSection: FC<DealerSectionProps> = ({ style, title, subtitle, icon }) => {
    return <Section style={style} title={title} subtitle={subtitle} icon={icon} />;
};
