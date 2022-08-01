import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { AppErrorBoundary } from "./components/Utilities/AppErrorBoundary";
import { LoadingContextProvider } from "./context/LoadingContext";
import { persistor, store } from "./store";

import "react-native-reanimated";

// Add locales to make them known for device deployment.
import "./i18n/momentLocales"
import "./i18n/index";

const Index = () => {
    return (
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
    );
};

registerRootComponent(Index);
