import { ReactNativeTracing } from "@sentry/react-native";
import { init as sentryInit } from "@sentry/react-native/dist/js/sdk";

import { sentryRoutingInstrumentation } from "../context/NavigationProvider";

sentryInit({
    dsn: "https://f3baa5424fef43dfa5e2e881b37c13de@o1343479.ingest.sentry.io/6647748",
    tracesSampleRate: 1,
    debug: false,
    integrations: [
        new ReactNativeTracing({
            traceFetch: true,
            enableAppStartTracking: true,
            enableNativeFramesTracking: true,
            traceXHR: true,
            enableStallTracking: true,
            shouldCreateSpanForRequest(url: string): boolean {
                return url.startsWith("/") || url.startsWith("http://localhost") || url.startsWith("https://localhost") || url.startsWith("https://app.eurofurence.org");
            },
            routingInstrumentation: sentryRoutingInstrumentation,
        }),
    ],
});
