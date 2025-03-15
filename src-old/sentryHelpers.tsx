import * as Sentry from "@sentry/react-native";
import type { CaptureContext, EventHint } from "@sentry/types";

/**
 * Capture parameter type enforced to CaptureContext.
 */
export type ContextType = CaptureContext &
    Partial<{
        [key in keyof EventHint]: never;
    }>;

export const captureNotificationException = (message: string, error: Error, hint?: ContextType) => {
    console.error(message, error);

    Sentry.captureException(error, {
        tags: {
            type: "notifications",
        },
        ...hint,
    });
};
