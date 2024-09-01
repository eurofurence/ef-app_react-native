import { z } from "zod";

const websiteUrlMatcher = /^\s*((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)\s*)?$/;
const telegramHandleMatcher = /^\s*(@?[a-zA-Z0-9_]{5,64}\s*)?$/;
const tableNumberMatcher = /^\s*[0-9]+\s*$/;

export const artistAlleySchema = z.object({
    displayName: z.string().min(1).trim(),
    websiteUrl: z
        .string()
        .regex(websiteUrlMatcher)
        .transform((value) => {
            if (value.trim().length === 0) return "";
            if (value.startsWith("http://") || value.startsWith("https://")) return value.trim();
            return `https://${value}`.trim();
        }),
    shortDescription: z.string().min(1).trim(),
    location: z.string().min(1).regex(tableNumberMatcher).trim(),
    telegramHandle: z.string().regex(telegramHandleMatcher).trim(),
    imageUri: z.string().min(1).url().trim(),
});
export type ArtistAlleySchema = z.infer<typeof artistAlleySchema>;
