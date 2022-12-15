import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tekvizion.aitbol.spotlight',
  appName: 'spotlight-mobile',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    splashScreen: {
      launchShowDuration: 0
    },
    pushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
};

export default config;
