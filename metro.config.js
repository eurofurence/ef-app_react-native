const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const { withNativeWind } = require('nativewind/metro')

// Apply Sentry configuration
const sentryConfig = getSentryExpoConfig(__dirname)

// Merge the configurations
const config = {
  ...sentryConfig,
  resolver: {
    ...sentryConfig.resolver,
    sourceExts: [...new Set([...sentryConfig.resolver.sourceExts, 'cjs'])],
  },
}

// Export with NativeWind configuration
module.exports = withNativeWind(config, { input: './src/css/globals.css' })
