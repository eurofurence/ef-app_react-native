import { useCalendars } from "expo-localization";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { formatInTimeZone } from "date-fns-tz";

import { conName, conTimeZone } from "@/configuration";
import { Label } from "../generic/atoms/Label";
import { Badge } from "../generic/containers/Badge";
import { useAuxiliary } from "@/store/auxiliary/slice";

export type TimezoneWarningProps = {
    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

const getUtcOffset = (date: Date, timeZone: string): number => {
    // Format the date in the specified time zone using the pattern "xxx" (e.g., +02:00 or -05:00)
    const offsetStr = formatInTimeZone(date, timeZone, "xxx");
    const sign = offsetStr.startsWith("-") ? -1 : 1;
    const [hours, minutes] = offsetStr.substring(1).split(":").map(Number);
    return sign * (hours * 60 + minutes);
};

export const TimezoneWarning: FC<TimezoneWarningProps> = ({ parentPad = 0 }) => {
    const { t } = useTranslation("Home");
    const { timeZone } = useCalendars()[0];

    // Using Context Instead of Redux
    const { state, dispatch } = useAuxiliary();
    const warningsHidden = state.timeZoneWarningsHidden;

    if (warningsHidden) {
        return null;
    }

    const now = new Date();
    const conTimeZoneOffset = getUtcOffset(now, conTimeZone);
    const deviceTimeZoneOffset = getUtcOffset(now, timeZone ?? conTimeZone);

    if (conTimeZoneOffset === deviceTimeZoneOffset) {
        return null;
    }

    return (
        <Badge unpad={parentPad} badgeColor="background" textColor="text" textType="para" icon="clock">
            {t("different_timezone", { convention: conName, conTimeZone, deviceTimeZone: timeZone })}
            <Label variant="bold" color="secondary" onPress={() => dispatch({ type: "HIDE_TIMEZONE_WARNINGS" })}>
                {" " + t("warnings.hide")}
            </Label>
        </Badge>
    );
};
