import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cebd883e3b274bb28f158524db91bba6',
  appName: 'fentanyl-awareness-day',
  webDir: 'dist',
  server: {
    url: 'https://cebd883e-3b27-4bb2-8f15-8524db91bba6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: {
        camera: 'Camera access is required to save images to your photo library.',
        photos: 'Photo library access is required to save awareness posts.'
      }
    },
    Media: {
      permissions: {
        photos: 'Photo library access is required to save awareness posts to your photo library.'
      }
    }
  }
};

export default config;