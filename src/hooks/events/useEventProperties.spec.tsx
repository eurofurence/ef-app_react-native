import moment from "moment";

import { useEventIsDone, useEventIsHappening } from "./useEventProperties";
import { renderHook } from "../../testUtils";

describe("useEventProperties", function () {
    describe("useEventIsHappening", () => {
        it("returns true if an event is happening now", () => {
            const event = {
                StartDateTimeUtc: moment().subtract(1, "hour").toISOString(),
                EndDateTimeUtc: moment().add(1, "hour").toISOString(),
            };
            const { result } = renderHook(() => useEventIsHappening(event), {});

            expect(result.current).toBeTruthy();
        });

        it("returns false if an event is in the past", () => {
            const event = {
                StartDateTimeUtc: moment().subtract(2, "hour").toISOString(),
                EndDateTimeUtc: moment().subtract(1, "hour").toISOString(),
            };
            const { result } = renderHook(() => useEventIsHappening(event), {});

            expect(result.current).toBeFalsy();
        });

        it("returns false if an event is in the future", () => {
            const event = {
                StartDateTimeUtc: moment().add(1, "hour").toISOString(),
                EndDateTimeUtc: moment().add(2, "hour").toISOString(),
            };
            const { result } = renderHook(() => useEventIsHappening(event), {});

            expect(result.current).toBeFalsy();
        });
    });

    describe("useEventIsDone", function () {
        it("returns true for an event in the past", () => {
            const event = {
                EndDateTimeUtc: moment().subtract(1, "hour").toISOString(),
            };

            const { result } = renderHook(() => useEventIsDone(event), {});

            expect(result.current).toBeTruthy();
        });

        it("returns false for an event in the that is still ongoing", () => {
            const event = {
                StartDateTimeUtc: moment().subtract(1, "hour").toISOString(),
                EndDateTimeUtc: moment().add(1, "hour").toISOString(),
            };

            const { result } = renderHook(() => useEventIsDone(event), {});

            expect(result.current).toBeFalsy();
        });

        it("returns false for an event in the future", () => {
            const event = {
                StartDateTimeUtc: moment().add(1, "day").toISOString(),
                EndDateTimeUtc: moment().add(1, "hour").add(1, "day").toISOString(),
            };

            const { result } = renderHook(() => useEventIsDone(event), {});

            expect(result.current).toBeFalsy();
        });
    });
});
