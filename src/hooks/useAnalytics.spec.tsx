import * as Analytics from "expo-firebase-analytics";

import { customRenderHook } from "../testUtils";
import { useAnalytics } from "./useAnalytics";

describe("useAnalytics", function () {
    it("should not try to log analytics when it is not enabled", () => {
        const spy = jest.spyOn(Analytics, "logEvent");
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

        result.result.current()("test", { test: 1 });

        expect(spy).not.toHaveBeenCalled();
    });

    it("should actually call analytics when it is enabled", () => {
        const spy = jest.spyOn(Analytics, "logEvent");
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

        result.result.current()("test", { test: 1 });

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
