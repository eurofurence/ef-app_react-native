import { wrap as sentryWrap } from "@sentry/react-native";
import { registerRootComponent } from "expo";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { App } from "./App";
import { SynchronizationProvider } from "./components/sync/SynchronizationProvider";
import { AuthContextProvider } from "./context/AuthContext";
import { NavigationProvider } from "./context/NavigationProvider";
import { persistor, store } from "./store";

import "react-native-reanimated";

// Import background notification connector and handler setup.
import "./init/BackgroundSyncGenerator";
import "./init/NotificationChannel";
import "./init/NotificationHandler";
import "./init/sentryInit";
import "./init/splash";

function Index() {
    return (
        <GestureHandlerRootView style={[StyleSheet.absoluteFill, styles.container]}>
            <StoreProvider store={store}>
                <PersistGate persistor={persistor}>
                    <AuthContextProvider>
                        <SynchronizationProvider>
                            <NavigationProvider>
                                <App />
                            </NavigationProvider>
                        </SynchronizationProvider>
                    </AuthContextProvider>
                </PersistGate>
            </StoreProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});

const WrappedIndex = sentryWrap(Index);

const RootComponent = () => <WrappedIndex />;
registerRootComponent(RootComponent);
