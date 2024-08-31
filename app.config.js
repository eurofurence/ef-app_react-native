import { convention } from "./convention.config.json";

const urlMatcher = /^([^:]+):\/\/([^/]+)(\/.*)$/;
const [, appBaseProtocol, appBaseHost, appBasePath] = [...convention.appBase.match(urlMatcher)];

module.exports = {
    expo: {
        runtimeVersion: {
            policy: "appVersion",
        },
        name: "Eurofurence",
        slug: "ef-app-react-native",
        description: "Your one stop shop to the convention!",
        owner: "eurofurence",
        version: "3.3.0",
        orientation: "default",
        icon: "./assets/platform/appicon.png",
        userInterfaceStyle: "automatic",
        scheme: "eurofurence",
        splash: {
            image: "./assets/platform/splash.png",
            resizeMode: "contain",
            backgroundColor: "#231F20",
        },
        updates: {
            fallbackToCacheTimeout: 0,
            url: "https://u.expo.dev/a60a3199-98db-4eec-8c66-cda6c424377d",
        },
        ios: {
            bundleIdentifier: "org.eurofurence",
            googleServicesFile: "./assets/platform/GoogleService-Info.plist",
            supportsTablet: true,
            infoPlist: {
                UIBackgroundModes: ["fetch", "remote-notification"],
            },
            associatedDomains: ["applinks:app.eurofurence.org", "applinks:app.test.eurofurence.org"],
        },
        android: {
            package: "org.eurofurence.connavigator",
            googleServicesFile: "./assets/platform/google-services.json",
            splash: {
                resizeMode: "native",
                image: "./assets/platform/splash.png",
                backgroundColor: "#231F20",
            },
            adaptiveIcon: {
                foregroundImage: "./assets/platform/appicon.png",
                backgroundColor: "#231F20",
            },
            intentFilters: [
                {
                    action: "VIEW",
                    autoVerify: true,
                    data: [
                        {
                            scheme: appBaseProtocol,
                            host: appBaseHost,
                            pathPrefix: `${appBasePath}/Web`,
                        },
                    ],
                    category: ["BROWSABLE", "DEFAULT"],
                },
                {
                    action: "VIEW",
                    autoVerify: true,
                    data: [
                        {
                            scheme: appBaseProtocol,
                            host: appBaseHost,
                            path: "/auth/login",
                        },
                    ],
                    category: ["BROWSABLE", "DEFAULT"],
                },
            ],
            permissions: ["INTERNET", "VIBRATE", "WRITE_EXTERNAL_STORAGE"],
            blockedPermissions: ["com.google.android.gms.permission.AD_ID"],
        },
        web: {
            bundler: "metro",
            favicon: "./assets/platform/appicon.png",
        },
        plugins: [
            // Run sentry plugin only if auth token is given, otherwise the build crashes.
            Boolean(global.process.env.SENTRY_AUTH_TOKEN) && [
                "@sentry/react-native/expo",
                {
                    project: "ef-app_react-native",
                    organization: "eurofurence",
                },
            ],
            // Import assets statically.
            [
                "expo-asset",
                {
                    assets: ["./assets/static"],
                },
            ],
            // Used to display push notifications.
            [
                "expo-notifications",
                {
                    icon: "./assets/platform/notification.png",
                    color: "#006459",
                },
            ],
            // Used to render audio.
            [
                "expo-av",
                {
                    microphonePermission: false,
                },
            ],
            // Used for artist alley registration
            [
                "expo-image-picker",
                {
                    photosPermission: "The app accesses your photos if you want to register for a table in the artist alley.",
                },
            ],
            "expo-localization",
            [
                "expo-build-properties",
                {
                    ios: {
                        deploymentTarget: "13.4",
                        useFrameworks: "static",
                        ccacheEnabled: true,
                        privacyManifestAggregationEnabled: true,
                    },
                },
            ],
            "@react-native-firebase/app",
            "expo-secure-store",
        ].filter(Boolean),
        extra: {
            eas: {
                projectId: "a60a3199-98db-4eec-8c66-cda6c424377d",
            },
        },
    },
};
