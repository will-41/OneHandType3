import type { CapacitorConfig } from '@capacitor/cli';

// To change the app id / name see docs/ANDROID_BUILD.md ("Changing the app id").
const config: CapacitorConfig = {
  appId: 'com.wilmymoise.onehandtype',
  appName: 'One-Type',
  webDir: 'dist/public',
  backgroundColor: '#0f101a',
  server: { androidScheme: 'https' },
  android: { allowMixedContent: false },
};

export default config;
