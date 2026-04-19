import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fourtrack.app',
  appName: '4Track',
  webDir: 'capacitor-web',
  server: {
    url: 'http://192.168.1.187:3000',
    cleartext: true,
    allowNavigation: ['192.168.1.187'],
  },
};

export default config;