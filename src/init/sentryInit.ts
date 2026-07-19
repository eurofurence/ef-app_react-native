import {
  reactNativeTracingIntegration,
  init as sentryInit,
} from '@sentry/react-native'
import { isRunningInExpoGo } from 'expo'

import { sentryDsn, sentryEnvironment } from '@/configuration'
import { redactSensitiveUrl } from '@/util/redactSensitiveUrl'

sentryInit({
  dsn: sentryDsn,
  tracesSampleRate: 0.8,
  profilesSampleRate: 0.8,
  enabled: process.env.NODE_ENV === 'production' || false,
  environment: sentryEnvironment || 'production',
  debug: false,
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.data?.url)
      breadcrumb.data.url = redactSensitiveUrl(breadcrumb.data.url)
    return breadcrumb
  },
  beforeSend(event) {
    if (event.request?.url)
      event.request.url = redactSensitiveUrl(event.request.url)
    return event
  },
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
