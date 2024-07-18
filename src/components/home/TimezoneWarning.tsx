import { useCalendars } from "expo-localization";
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

    if (conTimeZone === timeZone) {
        return null;
    }

    return (
        <Badge unpad={parentPad} badgeColor="background" textColor="text" textType="para" icon="clock">
            {t("different_timezone", { convention: conName })}
        </Badge>
    );
};
