import { sentryDsn, sentryEnabled, sentryEnvironment } from '@/configuration'
import { reactNativeTracingIntegration, init as sentryInit } from '@sentry/react-native'
import { isRunningInExpoGo } from 'expo'

sentryInit({
  dsn: sentryDsn,
  tracesSampleRate: 0.8,
  profilesSampleRate: 0.8,
  enabled: sentryEnabled || false,
  environment: sentryEnvironment || 'production',
  debug: false,
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
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
