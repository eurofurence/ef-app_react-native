import { registerRootComponent } from "expo";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { EurofurenceErrorBoundary } from "./components/Utilities/EurofurenceErrorBoundary";
import { persistor, store } from "./store";
import "./i18n";

const Index = () => {
    return (
        <StoreProvider store={store}>
            {/* @ts-expect-error Error boundaries are class based and they do not work nice with functions */}
            <EurofurenceErrorBoundary>
                <PersistGate persistor={persistor}>
                    <App />
                </PersistGate>
            </EurofurenceErrorBoundary>
        </StoreProvider>
    );
};

registerRootComponent(Index);
