const { getDefaultConfig } = require('expo/metro-config')
const { withSentryConfig } = require('@sentry/react-native/metro')
const { withNativeWind } = require('nativewind/metro')

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname)
config = withSentryConfig(config)
config = withNativeWind(config, { input: './src/css/globals.css' })

module.exports = config
