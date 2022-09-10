import { Provider } from "react-redux";
import { store } from "../src/store/index";
import { ThemeProvider } from "@react-navigation/native";
import {Story} from '@storybook/react'
export const decorators = [
    (Story: Story) => <Provider store={store}>
        <Story />
    </Provider>
];
export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    }
};
