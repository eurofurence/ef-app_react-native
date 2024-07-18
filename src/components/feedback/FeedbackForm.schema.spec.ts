import { feedbackSchema } from "./FeedbackForm.schema";

describe("feedbackSchema", () => {
    it("does not work for an empty model", () => {
        expect(() => feedbackSchema.parse({})).toThrowErrorMatchingSnapshot();
    });
    it("works for a rating and no message", () => {
        const result = feedbackSchema.parse({ rating: 1 });

        expect(result.rating).toEqual(1);
    });
    it("floors the rating", () => {
        const result = feedbackSchema.parse({ rating: 1.5 });

        expect(result.rating).toEqual(1);
    });
    it("can also include a message", () => {
        const message = "nice event";
        const result = feedbackSchema.parse({ rating: 5, message });

        expect(result.rating).toEqual(5);
        expect(result.message).toEqual(message);
    });

    it("does not work with a negative value", () => {
        expect(() => feedbackSchema.parse({ rating: -1 })).toThrowErrorMatchingSnapshot();
    });
    it("does not work with a large value", () => {
        expect(() => feedbackSchema.parse({ rating: 6 })).toThrowErrorMatchingSnapshot();
    });
    it("throws when the value is not a number", () => {
        expect(() => feedbackSchema.parse({ rating: "test" })).toThrowErrorMatchingSnapshot();
    });
});
