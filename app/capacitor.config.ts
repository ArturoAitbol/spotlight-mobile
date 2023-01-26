import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tekvizion.spotlight',
  appName: 'spotlight-mobile',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    splashScreen: {
      launchShowDuration: 0
    },
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Badge: {
      persist: true,
      autoClear: false,
    },
  },
};

export default config;
