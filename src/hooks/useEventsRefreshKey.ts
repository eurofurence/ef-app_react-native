import { useTranslation } from "react-i18next";

/**
 * Uses a key that can be used for refreshing events.
 * @param nowInterval The interval of the time slotting key.
 */
export const useEventsRefreshKey = (nowInterval = 5) => {
    const { t } = useTranslation("Dealer");
    return t;
};
