/**
 * Requests synchronization at the next possible time. Can be used in non-react
 * locations.
 */
export const requestSyncFromBackground = () => Promise.resolve();

/**
 * On initialization, checks if a sync was requested from a non-react
 * location, such as background tasks.
 * @constructor
 */
export const useBackgroundSyncManager = () => {
    // Web is stub.
};
