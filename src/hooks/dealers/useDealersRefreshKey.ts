import { useTranslation } from "react-i18next";

/**
 * Uses a key that can be used for refreshing dealer list.
 */
export const useDealersRefreshKey = () => {
    const { t } = useTranslation("Dealer");
    return t;
};
