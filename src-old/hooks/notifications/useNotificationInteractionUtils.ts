import { useCallback } from "react";
import { captureException } from "@sentry/react-native";
import { useSynchronizer } from "../../components/sync/SynchronizationProvider";
import { useAppDispatch, useAppStore } from "../../store";
import { announcementsSelectors, eventsSelector } from "../../store/eurofurence/selectors/records";
import { useGetCommunicationsQuery } from "../../store/eurofurence/service";

/**
 * Captures a local error to interaction assertions.
 * @param error The error to log.
 */
const captureInteractionException = (error: Error) =>
    captureException(error, {
        level: "info",
        tags: {
            type: "notifications",
        },
    });

/**
 * Uses functions to get data ready for notification interaction.
 */
export const useNotificationInteractionUtils = () => {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const { synchronize } = useSynchronizer();

    const { refetch } = useGetCommunicationsQuery();

    // Asserts an announcement is present. Synchronizes if not found immediately.
    const assertAnnouncement = useCallback(
        async (id: string | undefined | null) => {
            if (!id) return undefined;
            const candidate = announcementsSelectors.selectById(store.getState(), id);
            if (candidate) return candidate;
            await synchronize().catch(captureInteractionException);
            return announcementsSelectors.selectById(store.getState(), id);
        },
        [store, dispatch, synchronize],
    );

    // Asserts an event is present. Synchronizes if not found immediately.
    const assertEvent = useCallback(
        async (id: string | undefined | null) => {
            if (!id) return undefined;
            const candidate = eventsSelector.selectById(store.getState(), id);
            if (candidate) return candidate;
            await synchronize().catch(captureInteractionException);
            return eventsSelector.selectById(store.getState(), id);
        },
        [store, dispatch, synchronize],
    );

    // Asserts a private message is present. Re-fetches if not available immediately.
    const assertPrivateMessage = useCallback(
        async (id: string | undefined | null) => {
            if (!id) return undefined;
            const result = await refetch();
            return result.data?.find((item) => item.Id === id);
        },
        [store, dispatch, synchronize],
    );

    return {
        assertSynchronized: synchronize,
        assertAnnouncement,
        assertEvent,
        assertPrivateMessage,
    };
};
