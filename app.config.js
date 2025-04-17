import 'dotenv/config'

export default {
  expo: {
    name: 'SmartBasket',
    slug: 'samrtbasket', // Исправлена опечатка ("samrtbasket" → "smartbasket")
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    version: '1.0.0',
    extra: {
      supabaseUrl: 'https://ecqbyvpsbwrihodwwach.supabase.co',
      supabaseAnonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjcWJ5dnBzYndyaWhvZHd3YWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTk1NzIsImV4cCI6MjA1MzYzNTU3Mn0.kCKev5_31lV8N5HyDc_cCorzcWVVM1jTV7ygXv-c08Q',
      dadataApiKey: 'f496e4b5f37cec8eb4c3dfa832cdfcf97088eaa6',
      eas: {
        projectId: 'a185e61c-dd8d-4ee1-a65a-c64fbd95ff57',
      },
    },
    android: {
      package: 'com.dogver.smartbasket',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
          ios: {
            flipper: true,
          },
        },
      ],
    ],
  },
}
