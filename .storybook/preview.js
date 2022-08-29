import  {Provider as StoreProvider} from 'react-redux'
import {store} from "../src/store";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const decorators = [
    (Story) => (
        <StoreProvider store={store}>
            <Story />
        </StoreProvider>
    )
]
