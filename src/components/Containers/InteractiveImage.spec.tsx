import { offsetToAbsolute, rescale } from "./InteractiveImage";

describe("InteractiveImage", () => {
    describe("rescale", () => {
        it("returns the same value for the same scale", () => {
            const expected = 500;
            const result = rescale(expected, 1000, 1000);

            expect(result).toEqual(expected);
        });

        it("doubles the value when the target is doubled", () => {
            const expected = 500;
            const result = rescale(expected, 1000, 2000);

            expect(result).toEqual(expected * 2);
        });

        it("halves the value when the target is halved", () => {
            const expected = 500;
            const result = rescale(expected, 1000, 500);

            expect(result).toEqual(expected / 2);
        });
        it("returns 0 when the value should be 0", () => {
            const expected = 0;
            const result = rescale(expected, 1000, 500);

            expect(result).toEqual(0);
        });
        it("can also scale negatively", () => {
            const expected = -100;
            const result = rescale(expected, 1000, 1000);

            expect(result).toEqual(-100);
        });
    });

    describe("offsetToAbsolute", () => {
        it("should return the middle of the range if there is no offset", () => {
            const offset = 0;

            const result = offsetToAbsolute(offset, 1, 100);

            expect(result).toEqual([0, 100]);
        });

        it("should return 0 if the offset is exactly half of the range", () => {
            // If we are offset by half of the range and there is no scaling, then the left value should always be 0
            const result = offsetToAbsolute(50, 1, 100);

            expect(result).toEqual([-50, 50]);
        });

        it("should return half of the expected offset if it is scaled", () => {
            const result = offsetToAbsolute(0, 2, 100);

            expect(result).toEqual([25, 75]);
        });

        it("should return a smaller value if it is offset and scaled", () => {
            const result = offsetToAbsolute(25, 2, 100);

            expect(result).toEqual([12, 63]);
        });
        it("should return a negative value if we are extremely offset", () => {
            const result = offsetToAbsolute(100, 1, 100);

            expect(result).toEqual([-100, 0]);
        });
        it("should be 0 for a test casce with no scaling or offset", () => {
            const result = offsetToAbsolute(0, 1, 423);

            expect(result).toEqual([0, 423]);
        });
        it("should be 169 for a scaled test case with no offset", () => {
            const result = offsetToAbsolute(0, 5, 423);

            expect(result).toEqual([169, 254]);
        });
    });
});
