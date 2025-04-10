import { reactNativeTracingIntegration } from '@sentry/react-native'
import { init as sentryInit } from '@sentry/react-native/dist/js/sdk'
import conventionConfig from '../../convention.config.json'

sentryInit({
  dsn: conventionConfig.sentry.dsn,
  tracesSampleRate: 1,
  enabled: conventionConfig.sentry.enabled || false,
  debug: false,
  integrations: [
    reactNativeTracingIntegration({
      traceFetch: true,
      traceXHR: true,
      shouldCreateSpanForRequest(url: string): boolean {
        return (
          url.startsWith('/') ||
          url.startsWith('http://localhost') ||
          url.startsWith('https://localhost') ||
          url.startsWith('https://app.eurofurence.org') ||
          url.startsWith('https://app.test.eurofurence.org')
        )
      },
    }),
  ],
})
