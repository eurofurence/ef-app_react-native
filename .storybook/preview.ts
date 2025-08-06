import type { Preview } from '@storybook/react-native-web-vite'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryProvider } from '../src/context/query/Query'
import { CacheProvider } from '../src/context/data/Cache'
import { AuthProvider } from '../src/context/auth/Auth'
import { ToastProvider } from '../src/context/ui/ToastContext'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

// Import i18n configuration
import '../src/i18n'

// Import global CSS for styling
import '../src/css/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return React.createElement(GestureHandlerRootView, { style: { flex: 1 } },
        React.createElement(SafeAreaProvider, null,
          React.createElement(QueryProvider, null,
            React.createElement(CacheProvider, null,
              React.createElement(AuthProvider, null,
                React.createElement(ToastProvider, null,
                  React.createElement(BottomSheetModalProvider, null,
                    React.createElement(Story, null)
                  )
                )
              )
            )
          )
        )
      )
    },
  ],
};

export default preview;