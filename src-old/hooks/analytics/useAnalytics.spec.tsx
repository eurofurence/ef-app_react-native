import { customRenderHook } from "../../testUtils";
import { useAnalytics } from "./useAnalytics";

const mockLogEvent = jest.fn();
jest.mock("@react-native-firebase/analytics", () => {
    return () => ({
        logEvent: mockLogEvent,
    });
});

describe("useAnalytics", function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should not try to log analytics when it is not enabled", () => {
        const result = customRenderHook(() => useAnalytics(), {
            preloadedState: {
                settingsSlice: {
                    analytics: {
                        enabled: false,
                        prompted: false,
                    },
                },
            },
        });

        result.result.current("test", { test: 1 });

        expect(mockLogEvent).not.toHaveBeenCalled();
    });

    it("should actually call analytics when it is enabled", () => {
        const result = customRenderHook(() => useAnalytics(), {
            preloadedState: {
                settingsSlice: {
                    analytics: {
                        enabled: true,
                        prompted: false,
                    },
                },
            },
        });

        result.result.current("test", { test: 1 });

        expect(mockLogEvent).toHaveBeenCalledTimes(1);
    });
});
