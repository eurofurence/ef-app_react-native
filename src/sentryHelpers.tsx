import { ScopeContext } from "@sentry/types";
import { Browser, Native } from "sentry-expo";

/**
 * Holds either browser or native sentry.
 */
export const PlatformSentry = Native ?? Browser;
export const captureEvent = PlatformSentry.captureEvent;
export const captureException = PlatformSentry.captureException;

export const captureNotificationException = (message: string, error: Error, context: Partial<ScopeContext> = {}) => {
    console.error(message, error);

    Browser.captureException(error, {
        tags: {
            type: "notifications",
        },
        ...context,
    });
};

export const useSentryProfiler = "useProfiler" in PlatformSentry ? PlatformSentry.useProfiler : () => {};
