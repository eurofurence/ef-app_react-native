import moment from "moment";
import { FC, useMemo } from "react";

import { Section } from "../../components/Atoms/Section";
import { useNow } from "../../hooks/useNow";
import { IoniconsNames } from "../../types/Ionicons";

export type EventSectionProps = {
    timeUtc: string;
};

export const EventSection: FC<EventSectionProps> = ({ timeUtc }) => {
    const [now] = useNow();

    const title = useMemo(() => moment(timeUtc).format("LT"), [timeUtc]);
    const subtitle = useMemo(() => moment(timeUtc).from(now), [timeUtc, now]);

    const icon = useMemo<IoniconsNames>(() => {
        const hours = moment(timeUtc).hours();
        if (6 <= hours && hours < 12) return "sunny-outline";
        if (12 <= hours && hours < 18) return "sunny";
        if (18 <= hours && hours < 22) return "moon-outline";
        return "moon";
    }, [timeUtc]);

    return <Section title={title} subtitle={subtitle} icon={icon} />;
};
