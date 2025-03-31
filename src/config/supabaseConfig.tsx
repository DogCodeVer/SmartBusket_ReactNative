import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
// import 'react-native-url-polyfill/auto';

// Замените на свои URL и ключ API
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage, // Подключение AsyncStorage для хранения токенов
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false, // Важно для React Native
	},
});

export default supabase;
