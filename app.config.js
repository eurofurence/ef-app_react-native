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
        icon: "./assets/platform/playstore.png",
        userInterfaceStyle: "automatic",
        scheme: "eurofurence",
        splash: {
            image: "./assets/platform/playstore.png",
            resizeMode: "contain",
            backgroundColor: "#035451",
        },
        updates: {
            fallbackToCacheTimeout: 0,
            url: "https://u.expo.dev/a60a3199-98db-4eec-8c66-cda6c424377d",
        },
        ios: {
            supportsTablet: true,
        },
        android: {
            package: "org.eurofurence.connavigator",
            googleServicesFile: "./assets/platform/google-services.json",
            splash: {
                resizeMode: "native",
                image: "./assets/platform/splash.png",
                backgroundColor: "#006459",
            },
            adaptiveIcon: {
                foregroundImage: "./assets/platform/playstore.png",
                backgroundColor: "#006459",
            },
            intentFilters: [
                {
                    action: "VIEW",
                    autoVerify: true,
                    data: [
                        {
                            scheme: "https",
                            host: "app.eurofurence.org",
                            pathPrefix: "/EF27/Web",
                        },
                    ],
                    category: ["BROWSABLE", "DEFAULT"],
                },
                {
                    action: "VIEW",
                    autoVerify: true,
                    data: [
                        {
                            scheme: "https",
                            host: "app.eurofurence.org",
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
            favicon: "./assets/platform/playstore.png",
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
            "expo-localization",
            "expo-build-properties",
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
