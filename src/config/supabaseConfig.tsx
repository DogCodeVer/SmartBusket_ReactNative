import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
// import 'react-native-url-polyfill/auto';

// Замените на свои URL и ключ API
const supabaseUrl = Constants.expoConfig.extra.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig.extra.supabaseAnonKey;
console.log(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage, // Подключение AsyncStorage для хранения токенов
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false, // Важно для React Native
	},
});

export default supabase;
