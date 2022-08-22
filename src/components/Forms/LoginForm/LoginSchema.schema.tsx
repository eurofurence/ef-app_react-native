import { z } from "zod";

export const loginSchema = z.object({
    regno: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().min(1).max(99999)),
    username: z.string().min(1),
    password: z.string().min(1),
});
export type LoginSchema = z.infer<typeof loginSchema>;
