import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useNowRefreshKey } from "./useNowRefreshKey";

/**
 * Uses a key that can be used for refreshing events.
 * @param nowInterval The interval of the time slotting key.
 */
export const useEventsRefreshKey = (nowInterval = 5) => {
    const { t } = useTranslation("Event");
    const nowRefreshKey = useNowRefreshKey(nowInterval);
    return useMemo(() => [t, nowRefreshKey], [t, nowRefreshKey]);
};
