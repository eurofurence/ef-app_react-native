import { z } from "zod";

const urlLikeMatcher = /^\s*(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)\s*$/;
const telegramMatcher = /^\s*@?[a-zA-Z0-9_]{5,64}\s*$/;

export const artistAlleySchema = z.object({
    displayName: z.string().min(1).trim(),
    websiteUrl: z
        .string()
        .min(1)
        .regex(urlLikeMatcher)
        .transform((value) => {
            if (value.startsWith("http://") || value.startsWith("https://")) return value.trim();
            return `https://${value}`.trim();
        }),
    shortDescription: z.string().min(1).trim(),
    location: z.string().min(1).trim(),
    telegramHandle: z.string().min(1).regex(telegramMatcher).trim(),
    imageUri: z.string().min(1).url().trim(),
});
export type ArtistAlleySchema = z.infer<typeof artistAlleySchema>;
