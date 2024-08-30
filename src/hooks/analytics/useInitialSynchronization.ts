import { captureException } from "@sentry/react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useSynchronizer } from "../../components/sync/SynchronizationProvider";

/**
 * Uses initial synchronization.
 */
export const useInitialSynchronization = () => {
    const { t } = useTranslation("Home");
    const { synchronizeUi } = useSynchronizer();

    useEffect(() => {
        synchronizeUi(false).catch(captureException);
    }, [synchronizeUi, t]);
};
