import { legacy_createStore } from "@reduxjs/toolkit";
import { render, renderHook } from "@testing-library/react-native";
import { ReactElement } from "react";
import { Provider as StoreProvider } from "react-redux";

import { reducers, RootState, store } from "./store";

type ReduxOptions = {
    preloadedState?: Partial<RootState>;
    store?: typeof store;
};

export const customRender = <Result,>(ui: ReactElement<Result>, options: ReduxOptions = {}): ReturnType<typeof render> => {
    const preloadedState = options.preloadedState as any;
    const store = legacy_createStore(reducers, preloadedState);

    const wrapper = ({ children }: { children: any }) => <StoreProvider store={store}>{children}</StoreProvider>;

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

    const wrapper = ({ children }: { children: any }) => <StoreProvider store={store}>{children}</StoreProvider>;

    return renderHook(renderCallback, { wrapper });
};

export * from "@testing-library/react-native";

export { customRender as render, customRenderHook as renderHook };
