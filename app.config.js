export default {
  "expo": {
    "name": "Sign Talker",
    "slug": "sign-talker-app-osvfnjwcfe0c4hmeej-az",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": "com.anindiyasaputra.signtalker",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#ffffff"
      }
    },
    "extra": {
      "eas": {
        "projectId": "b464565d-0850-49a7-83de-74ccb072a72c"
      }
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "extraMavenRepos": [
              "https://www.jitpack.io"
            ]
          }
        }
      ]
    ]
  }
}
