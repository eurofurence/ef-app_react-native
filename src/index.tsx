import { registerRootComponent } from "expo";
import { FC } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { AppErrorBoundary } from "./components/app/util/AppErrorBoundary";
import { LoadingContextProvider } from "./context/LoadingContext";
import { persistor, store } from "./store";

import "react-native-reanimated";

// Import background notification connector and handler setup.
import "./init/BackgroundSyncGenerator";
import "./init/NotificationChannel";
import "./init/NotificationHandler";
import "./init/sentryInit";

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
