import { registerRootComponent } from "expo";
import { Provider as StoreProvider } from "react-redux";

import App from "./App";
import { store } from "./store";

const Index = () => {
    return (
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    );
};

registerRootComponent(Index);
