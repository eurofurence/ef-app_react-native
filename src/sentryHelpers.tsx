import { ScopeContext } from "@sentry/types";
import { Browser, Native } from "sentry-expo";

export const captureEvent = Browser.captureEvent;
export const captureException = Browser.captureException;

export const captureNotificationException = (message: string, error: Error, context: Partial<ScopeContext> = {}) => {
    console.error(message, error);

    Browser.captureException(error, {
        tags: {
            type: "notifications",
        },
        ...context,
    });
};

export const useSentryProfiler = Native.useProfiler;
