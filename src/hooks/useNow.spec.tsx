import moment from "moment";

import { customRenderHook, renderHook } from "../testUtils";
import { useNow } from "./useNow";

describe("useNow", function () {
    beforeEach(() => {
        jest.mock("moment", () => {
            return () => jest.requireActual("moment")("2020-01-01T12:00:00.000Z");
        });
    });
    it("returns now when no state is supplied", () => {
        const { result } = renderHook(() => useNow(), {});

        expect(result.current.valueOf()).toBeCloseTo(moment().valueOf(), -2);
    });

    it("returns a time in the future if a state is supplied", () => {
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

        expect(diff).toBe(59);
    });
    it("returns a time in the past if a state is supplied with a negative amount", () => {
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

        expect(diff).toBe(-60);
    });

    it("does not apply timetravel when it is not enabled", () => {
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
