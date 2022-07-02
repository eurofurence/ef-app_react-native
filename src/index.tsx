import { registerRootComponent } from "expo";
import { Provider as StoreProvider } from "react-redux";

import App from "./App";
import { EurofurenceErrorBoundary } from "./components/Utilities/EurofurenceErrorBoundary";
import { store } from "./store";

const Index = () => {
    return (
        <StoreProvider store={store}>
            {/* @ts-expect-error Error boundaries are class based and they do not work nice with functions */}
            <EurofurenceErrorBoundary>
                <App />
            </EurofurenceErrorBoundary>
        </StoreProvider>
    );
};

registerRootComponent(Index);
