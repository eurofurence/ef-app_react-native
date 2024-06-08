import { FC } from "react";

import { IconNames } from "../generic/atoms/Icon";
import { Section, SectionProps } from "../generic/atoms/Section";

export type DealerSectionProps = SectionProps;

/**
 * Creates the properties for a dealer section.
 * @param firstLetter The first letter.
 */
export function dealerSectionForLetter(firstLetter: string): DealerSectionProps {
    return {
        title: firstLetter,
        icon: "bookmark" as IconNames,
    };
}

export const DealerSection: FC<DealerSectionProps> = ({ title, subtitle, icon }) => {
    return <Section title={title} subtitle={subtitle} icon={icon} />;
};
