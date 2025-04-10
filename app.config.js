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
        version: "5.0.1",
        orientation: "default",
        userInterfaceStyle: "automatic",
        scheme: "eurofurence",
        splash: {
            image: "./assets/platform/splash.png",
            resizeMode: "contain",
            backgroundColor: "#231F20",
        },
        ios: {
            bundleIdentifier: "org.eurofurence",
            icon: "./assets/platform/appicon-ios.png",
            googleServicesFile: "./assets/platform/GoogleService-Info.plist",
            supportsTablet: true,
            infoPlist: {
                UIBackgroundModes: ["fetch", "remote-notification"],
            },
            associatedDomains: ["applinks:app.eurofurence.org", "applinks:app.test.eurofurence.org"],
        },
        android: {
            package: "org.eurofurence.connavigator",
            icon: "./assets/platform/appicon-android.png",
            googleServicesFile: "./assets/platform/google-services.json",
            splash: {
                resizeMode: "native",
                image: "./assets/platform/splash.png",
                backgroundColor: "#231F20",
            },
            adaptiveIcon: {
                foregroundImage: "./assets/platform/appicon-android.png",
                backgroundColor: "#231F20",
                monochromeImage: "./assets/platform/appicon-android-monochrome.png",
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
            favicon: "./assets/platform/appicon-android.png",
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
            // Used for Artist Alley registration
            [
                "expo-image-picker",
                {
                    photosPermission: "The app accesses your photos if you want to register for a table in the Artist Alley.",
                },
            ],
            "expo-localization",
            [
                "expo-build-properties",
                {
                    ios: {
                        deploymentTarget: "15.1",
                        useFrameworks: "static",
                        cacheEnabled: true,
                        privacyManifestAggregationEnabled: true,
                    },
                },
            ],
            "@react-native-firebase/app",
            "expo-secure-store",
            "expo-router",
            "expo-sqlite",
        ].filter(Boolean),
        extra: {
            eas: {
                projectId: "a60a3199-98db-4eec-8c66-cda6c424377d",
            },
        },
    },
};
