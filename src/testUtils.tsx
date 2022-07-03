import { legacy_createStore } from "@reduxjs/toolkit";
import { render, renderHook } from "@testing-library/react-native";
import { Provider as StoreProvider } from "react-redux";

import { reducers, RootState, store } from "./store";

type ReduxOptions = {
    preloadedState?: Partial<RootState>;
    store?: typeof store;
};

export const customRender = <Result,>(ui, options: ReduxOptions = {}) => {
    const preloadedState = options.preloadedState as any;
    const store = legacy_createStore(reducers, preloadedState);

    const wrapper = ({ children }) => <StoreProvider store={store}>{children}</StoreProvider>;

    return render<Result>(ui, { wrapper });
};

interface RenderHookResult<Result, Props> {
    rerender: (props: Props) => void;
    result: { current: Result };
    unmount: () => void;
}

export const customRenderHook = <Result, Props>(renderCallback: (props: Props) => Result, options: ReduxOptions): RenderHookResult<Result, Props> => {
    const preloadedState = options.preloadedState as any;
    const store = legacy_createStore(reducers, preloadedState);

    const wrapper = ({ children }) => <StoreProvider store={store}>{children}</StoreProvider>;

    // @ts-ignore This type somehow does not match
    return renderHook(renderCallback, { wrapper });
};

export * from "@testing-library/react-native";

export { customRender as render, customRenderHook as renderHook };
