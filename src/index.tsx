import { registerRootComponent } from "expo";
import { FC } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as Sentry from "sentry-expo";

import App from "./App";
import { AppErrorBoundary } from "./components/Utilities/AppErrorBoundary";
import { LoadingContextProvider } from "./context/LoadingContext";
import { sentryRoutingInstrumentation } from "./context/NavigationProvider";
import { PlatformSentry } from "./sentryHelpers";
import { persistor, store } from "./store";

import "react-native-reanimated";

// Import background notification connector and handler setup.
import "./components/Managers/BackgroundSyncGenerator";
import "./components/Managers/NotificationChannel";
import "./components/Managers/NotificationHandler";

Sentry.init({
    dsn: "https://f3baa5424fef43dfa5e2e881b37c13de@o1343479.ingest.sentry.io/6647748",
    enableInExpoDevelopment: false,
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    tracesSampleRate: 1,
    integrations:
        "ReactNativeTracing" in PlatformSentry
            ? [
                  new PlatformSentry.ReactNativeTracing({
                      traceFetch: true,
                      enableAppStartTracking: true,
                      enableNativeFramesTracking: true,
                      traceXHR: true,
                      enableStallTracking: true,
                      tracingOrigins: ["localhost", "app.eurofurence.org", /^\//],
                      routingInstrumentation: sentryRoutingInstrumentation,
                  }),
              ]
            : [],
});

const Index: FC = () => {
    return (
        <GestureHandlerRootView style={[StyleSheet.absoluteFill, styles.container]}>
            <SafeAreaProvider>
                <StoreProvider store={store}>
                    <AppErrorBoundary>
                        <PersistGate persistor={persistor}>
                            <LoadingContextProvider>
                                <App />
                            </LoadingContextProvider>
                        </PersistGate>
                    </AppErrorBoundary>
                </StoreProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});

const WrappedIndex = Index;

const RootComponent = () => <WrappedIndex />;
registerRootComponent(RootComponent);
