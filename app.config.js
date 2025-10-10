import 'dotenv/config';

export default {
  expo: {
    name: "XCart.ai",
    slug: "xcart",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/xcartlogoblack.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splashscreen.png",
      resizeMode: "cover",
      backgroundColor: "#000000"
    },
    ios: {
      buildNumber: "1",
      supportsTablet: true,
      bundleIdentifier: "com.saturnoconsulting.xcart",
      entitlements: {
        "aps-environment": "production", // o "development" a seconda dell'ambiente
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserNotificationUsageDescription: "Questa app utilizza le notifiche per informarti su eventi importanti."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/xcartlogoblack.png",
        backgroundColor: "#FFFFFF",
      },
      edgeToEdgeEnabled: true,
      versionCode: 1,
      package: "com.saturnoconsulting.xcart",
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "95ee478b-f08f-42a5-911f-69fa670d7596"
      },
      apiUrl: process.env.API_URL, // ora legge dalla variabile d'ambiente
      licenseKey: process.env.LICENSE, // ora legge dalla variabile d'ambiente
      idsalespointkey: process.env.IDSALESPOINT, // ora legge dalla variabile d'ambiente
    },
    runtimeVersion: "1.0.2",
    updates: {
      url: "https://u.expo.dev/95ee478b-f08f-42a5-911f-69fa670d7596",
      enabled: true,
      fallbackToCacheTimeout: 0
    },
    plugins: [
      "expo-font",
      [
        "expo-system-ui",
        {
          edgeToEdgeEnabled: true,
        },
      ],
      [
      "expo-notifications",
      {
        icon: "assets/notification-icon.png",
        color: "#ffffff",
      },
      ],
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": false,
          "supportsPictureInPicture": true
        }
      ]
    ]
  }
};
