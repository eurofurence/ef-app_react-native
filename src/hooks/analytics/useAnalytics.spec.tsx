import analytics from "@react-native-firebase/analytics";

import { useAnalytics } from "./useAnalytics";
import { customRenderHook } from "../../testUtils";

describe("useAnalytics", function () {
    it("should not try to log analytics when it is not enabled", () => {
        const spy = jest.spyOn(analytics(), "logEvent");
        spy.mockImplementation();

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

        expect(spy).not.toHaveBeenCalled();
    });

    it("should actually call analytics when it is enabled", () => {
        const spy = jest.spyOn(analytics(), "logEvent");
        spy.mockImplementation();

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

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
