import { ScopeContext } from "@sentry/types/dist/scope";
import { Browser } from "sentry-expo";

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
