import { registerRootComponent } from "expo";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { AppErrorBoundary } from "./components/Utilities/AppErrorBoundary";
import { LoadingContextProvider } from "./context/LoadingContext";
import { persistor, store } from "./store";

import "./i18n/index";

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
