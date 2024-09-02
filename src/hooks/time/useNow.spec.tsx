import moment from "moment";

import { customRenderHook, renderHook } from "../../testUtils";
import { useNow } from "./useNow";

describe("useNow", function () {
    beforeEach(() => {
        jest.mock("moment", () => {
            return () => jest.requireActual("moment")("2020-01-01T12:00:00.000Z");
        });
    });
    it("returns now when no state is supplied", async () => {
        const { result } = renderHook(() => useNow(), {});

        expect(result.current.valueOf()).toBeCloseTo(moment().valueOf(), -2);
    });

    it("returns a time in the future if a state is supplied", async () => {
        const { result } = customRenderHook(() => useNow(), {
            preloadedState: {
                timetravel: {
                    amount: moment.duration(1, "hour").asMilliseconds(),
                    enabled: true,
                    visible: false,
                },
            },
        });

        const diff = result.current.diff(moment(), "minutes");

        expect(diff).toBeCloseTo(60, 1);
    });
    it("returns a time in the past if a state is supplied with a negative amount", async () => {
        const { result } = customRenderHook(() => useNow(), {
            preloadedState: {
                timetravel: {
                    amount: moment.duration(1, "hour").asMilliseconds() * -1,
                    enabled: true,
                    visible: false,
                },
            },
        });

        const diff = result.current.diff(moment(), "minutes");

        expect(diff).toBeCloseTo(-60, 1);
    });

    it("does not apply timetravel when it is not enabled", async () => {
        const { result } = customRenderHook(() => useNow(), {
            preloadedState: {
                timetravel: {
                    amount: moment.duration(1, "hour").asMilliseconds() * -1,
                    enabled: false,
                    visible: false,
                },
            },
        });

        const diff = result.current.diff(moment(), "minutes");

        expect(diff).toBe(0);
    });
});
