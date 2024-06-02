import { FC } from "react";

import { Section, SectionProps } from "../../generic/atoms/Section";

export type EventSectionProps = SectionProps;

export const EventSection: FC<EventSectionProps> = ({ title, subtitle, icon }) => {
    return <Section title={title} subtitle={subtitle} icon={icon} />;
};
