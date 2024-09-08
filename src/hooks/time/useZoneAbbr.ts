import moment from "moment-timezone";
import { useCalendars } from "expo-localization";
import { useMemo } from "react";
import { conTimeZone } from "../../configuration";

/**
 * Uses the currently selected calendar's zone abbreviation.
 */
export const useZoneAbbr = () => {
    const calendar = useCalendars();
    return useMemo(() => moment.tz(calendar[0]?.timeZone ?? conTimeZone).zoneAbbr(), [calendar[0]?.timeZone]);
};
