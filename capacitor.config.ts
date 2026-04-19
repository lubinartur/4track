import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fourtrack.app',
  appName: '4Track',
  webDir: 'capacitor-web',
  server: {
    url: 'https://4track-gamma.vercel.app',
    allowNavigation: ['4track-gamma.vercel.app'],
  },
};

export default config;