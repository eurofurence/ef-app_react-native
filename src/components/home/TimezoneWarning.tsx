import { useCalendars } from "expo-localization";
import moment from "moment-timezone";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { conName, conTimeZone } from "../../configuration";
import { Badge } from "../generic/containers/Badge";

export type TimezoneWarningProps = {
    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

export const TimezoneWarning: FC<TimezoneWarningProps> = ({ parentPad = 0 }) => {
    const { t } = useTranslation("Home");
    const { timeZone } = useCalendars()[0];

    const now = new Date();
    const conTimeZoneOffset = moment.tz(now, conTimeZone).utcOffset();
    const deviceTimeZoneOffset = moment.tz(now, timeZone ?? conTimeZone).utcOffset();

    if (conTimeZoneOffset === deviceTimeZoneOffset) {
        return null;
    }

    return (
        <Badge unpad={parentPad} badgeColor="background" textColor="text" textType="para" icon="clock">
            {t("different_timezone", { convention: conName, conTimeZone, deviceTimeZone: timeZone })}
        </Badge>
    );
};
