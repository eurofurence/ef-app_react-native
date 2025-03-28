import { z } from "zod";

export const feedbackSchema = z.object({
    rating: z
        .number()
        .min(1)
        .max(5)
        .transform((n) => Math.floor(n)),
    message: z.string().optional(),
    eventId: z.string(),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>; 