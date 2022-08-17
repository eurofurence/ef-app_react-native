// eslint-disable-next-line no-undef
const env = process.env;

module.exports = () => ({
    expo: {
        entryPoint: "./src/index.tsx",
        name: "Eurofurence",
        slug: "ef-app-react-native",
        description: "Your one stop shop to the convention!",
        owner: "eurofurence",
        version: "3.0.0",
        orientation: "default",
        icon: "./assets/images/playstore.png",
        userInterfaceStyle: "automatic",
        scheme: "eurofurence",
        splash: {
            image: "./assets/images/playstore.png",
            resizeMode: "contain",
            backgroundColor: "#035451",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["assets/**/*", "android/**/*"],
        ios: {
            supportsTablet: true,
        },
        android: {
<<<<<<< Updated upstream
            versionCode: 423,
=======
            versionCode: 424,
>>>>>>> Stashed changes
            package: "org.eurofurence.connavigator",
            googleServicesFile: "./assets/android/google-services.json",
            splash: {
                resizeMode: "native",
            },
            adaptiveIcon: {
                foregroundImage: "./assets/images/playstore.png",
                backgroundColor: "#006459",
            },
            intentFilters: [
                {
                    action: "VIEW",
                    autoVerify: false,
                    data: [
                        {
                            scheme: "https",
                            host: "app.eurofurence.org",
                            pathPrefix: "/EF26/Web/",
                        },
                    ],
                    category: ["BROWSABLE", "DEFAULT"],
                },
            ],
            permissions: ["INTERNET", "VIBRATE", "WRITE_EXTERNAL_STORAGE"],
        },
        web: {
            favicon: "./assets/images/playstore.png",
            config: {
                firebase: {
                    apiKey: "AIzaSyCF365l8zUac096MFPLUtbPE6sqH182G2Q",
                    authDomain: "eurofurence-de86f.firebaseapp.com",
                    databaseURL: "https://eurofurence-de86f.firebaseio.com",
                    projectId: "eurofurence-de86f",
                    storageBucket: "eurofurence-de86f.appspot.com",
                    messagingSenderId: "1003745003618",
                    appId: "1:1003745003618:web:6eca6a1ec8f5d5bfe9e93b",
                    measurementId: "G-83EP75M02N",
                },
            },
        },
        plugins: [
            "sentry-expo",
            [
                "expo-notifications",
                {
                    icon: "./assets/images/notification.png",
                    color: "#006459",
                },
            ],
        ],
        hooks: {
            postPublish: [
                env.SENTRY_TOKEN && {
                    file: "sentry-expo/upload-sourcemaps",
                    config: {
                        organization: "eurofurence",
                        project: "ef-app_react-native",
                        authToken: env.SENTRY_TOKEN,
                    },
                },
            ].filter(Boolean),
        },
    },
});
