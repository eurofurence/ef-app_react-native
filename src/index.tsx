import { registerRootComponent } from "expo";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { AppErrorBoundary } from "./components/Utilities/AppErrorBoundary";
import { LoadingContextProvider } from "./context/LoadingContext";
import { persistor, store } from "./store";

import "react-native-reanimated";

// Add locales to make them known for device deployment.
import "./i18n/index";
import "moment/locale/de";
import "moment/locale/nl";

const Index = () => {
    return (
        <StoreProvider store={store}>
            <AppErrorBoundary>
                <PersistGate persistor={persistor}>
                    <LoadingContextProvider>
                        <App />
                    </LoadingContextProvider>
                </PersistGate>
            </AppErrorBoundary>
        </StoreProvider>
    );
};

registerRootComponent(Index);
