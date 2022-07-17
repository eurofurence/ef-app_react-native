import { FC } from "react";

import { Section, SectionProps } from "../../components/Atoms/Section";

export type DealerSectionProps = SectionProps;

export const DealerSection: FC<DealerSectionProps> = ({ title, subtitle, icon }) => {
    return <Section title={title} subtitle={subtitle} icon={icon} />;
};
