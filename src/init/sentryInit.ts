import { reactNativeTracingIntegration } from "@sentry/react-native";
import { init as sentryInit } from "@sentry/react-native/dist/js/sdk";

sentryInit({
    dsn: "https://696266a343bdef6d646954f75ee6ea72@o4507884376621056.ingest.de.sentry.io/4507884381732944",
    tracesSampleRate: 1,
    debug: false,
    integrations: [
        reactNativeTracingIntegration({
            traceFetch: true,
            traceXHR: true,
            shouldCreateSpanForRequest(url: string): boolean {
                return (
                    url.startsWith("/") ||
                    url.startsWith("http://localhost") ||
                    url.startsWith("https://localhost") ||
                    url.startsWith("https://app.eurofurence.org") ||
                    url.startsWith("https://app.test.eurofurence.org")
                );
            },
        }),
    ],
});
