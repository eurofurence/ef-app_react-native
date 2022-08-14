import _ from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { selectFavoriteEvents } from "../../store/eurofurence.selectors";
import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";

export const FavoriteEventsList = () => {
    const { t } = useTranslation("Events");
    const [now] = useNow();
    const events = useAppSelector(selectFavoriteEvents);

    const sections = useMemo(() => {
        const [past, upcoming] = _.partition(events, (it) => now.isAfter(it.EndDateTimeUtc, "minutes"));

        const upcomingSections = _.chain(upcoming)
            .orderBy((it) => moment(it.StartDateTimeUtc).valueOf(), "asc")
            .groupBy((it) => it.ConferenceDay?.Name)
            .map((items, day) => ({
                title: day,
                data: items,
            }))
            .value();

        return [
            ...upcomingSections,
            {
                title: t("events_done"),
                data: past,
            },
        ];
    }, [events]);

    return (
        <EventsSectionedListGeneric
            eventsGroups={sections}
            cardType={"time"}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {t("favorites_title")}
                </Label>
            }
        />
    );
};
