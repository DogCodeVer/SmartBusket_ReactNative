import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import supabase from '../config/supabaseConfig';
import { styles } from '../styles/SignIn';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn: React.FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isFocusedPassword, setIsFocusedPassword] = useState(false);
	const [isFocusedEmail, setIsFocusedEmail] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSignIn = async () => {
		if (!email || !password) {
			Alert.alert('Ошибка', 'Введите email и пароль');
			return;
		}

		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error) {
			Alert.alert('Ошибка авторизации', error.message);
		} else {
			navigation.replace('Home'); // Переход без возможности возврата на экран входа
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Авторизация</Text>

			<TextInput
				style={[styles.input, isFocusedEmail && styles.inputFocused]}
				onFocus={() => setIsFocusedEmail(true)}
				onBlur={() => setIsFocusedEmail(false)}
				placeholder='Email'
				placeholderTextColor='#999'
				onChangeText={setEmail}
				value={email}
				keyboardType='email-address'
				autoCapitalize='none'
			/>
			<TextInput
				style={[styles.input, isFocusedPassword && styles.inputFocused]}
				onFocus={() => setIsFocusedPassword(true)}
				onBlur={() => setIsFocusedPassword(false)}
				placeholder='Пароль'
				placeholderTextColor='#999'
				secureTextEntry
				onChangeText={setPassword}
				value={password}
			/>

			<View style={styles.footer}>
				<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
					<Text style={styles.footerText}>Регистрация</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => navigation.navigate('PasswordRecovery')}
				>
					<Text style={styles.footerText_forgotpass}>Забыли пароль?</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={[styles.button, loading && styles.buttonDisabled]}
				onPress={handleSignIn}
				disabled={loading}
			>
				<Text style={styles.buttonText}>{loading ? 'Вход...' : 'Войти'}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default SignIn;
