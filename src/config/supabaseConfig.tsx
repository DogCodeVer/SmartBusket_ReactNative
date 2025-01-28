import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
// import 'react-native-url-polyfill/auto';

// Замените на свои URL и ключ API
const supabaseUrl = 'https://ecqbyvpsbwrihodwwach.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjcWJ5dnBzYndyaWhvZHd3YWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTk1NzIsImV4cCI6MjA1MzYzNTU3Mn0.kCKev5_31lV8N5HyDc_cCorzcWVVM1jTV7ygXv-c08Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage, // Подключение AsyncStorage для хранения токенов
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false, // Важно для React Native
	},
});

export default supabase;
