import _ from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";
import { useNow } from "../../../hooks/time/useNow";
import { useAppSelector } from "../../../store";
import { selectFavoriteEvents } from "../../../store/eurofurence.selectors";
import { Label } from "../../generic/atoms/Label";

export const PersonalScheduleList = () => {
    const { t } = useTranslation("Events");
    const [now] = useNow();
    const events = useAppSelector(selectFavoriteEvents);

    const sections = useMemo(() => {
        const [past, upcoming] = _.partition(events, (it) => now.isAfter(it.EndDateTimeUtc, "minutes"));

        const upcomingSections = _.chain(upcoming)
            .orderBy((it) => moment(it.StartDateTimeUtc).valueOf(), "asc")
            .groupBy((it) => it.ConferenceDay?.Name)
            .flatMap((items, day) => [
                {
                    title: day,
                },
                ...items,
            ])
            .value();

        if (past.length > 0) {
            upcomingSections.push(
                {
                    title: t("finished"),
                },
                ...past,
            );
        }

        return upcomingSections;
    }, [events]);

    const leader = useMemo(() => {
        return (
            <Label type="h1" variant="middle" mt={30}>
                {t("schedule_title")}
            </Label>
        );
    }, [t]);

    const empty = useMemo(() => {
        return (
            <Label type="para" variant="middle" mt={30}>
                {t("schedule_empty")}
            </Label>
        );
    }, [t]);

    return <EventsSectionedListGeneric eventsGroups={sections} cardType={"time"} leader={leader} empty={empty} />;
};
