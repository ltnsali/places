import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ltnsali.places',
  appName: 'Yakındaki Mekânlar',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
