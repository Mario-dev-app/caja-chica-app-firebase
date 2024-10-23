import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Caja Chica',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  },
  ios: {
    // ... additional configuration
    handleApplicationNotifications: false
  }
};

export default config;
