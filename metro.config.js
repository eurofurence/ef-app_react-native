const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const { withNativeWind } = require('nativewind/metro')

/** @type {import('expo/metro-config').MetroConfig} */
let config = getSentryExpoConfig(__dirname)
config = withNativeWind(config, { input: './src/css/globals.css' })

module.exports = config
