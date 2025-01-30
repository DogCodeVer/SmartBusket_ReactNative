import React from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import supabase from '../config/supabaseConfig';

import { styles } from '../styles/SignIn';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn: React.FC<Props> = ({ navigation }) => {
	const [email, onChangeEmail] = React.useState('');
	const [password, onChangePassword] = React.useState('');
	const [isFocusedPassword, setIsFocusedPassword] = React.useState(false);
	const [isFocusedEmail, setIsFocusedEmail] = React.useState(false);

	const handleSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});
		// navigation.navigate('Home');
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
				onChangeText={onChangeEmail}
				value={email}
			/>
			<TextInput
				style={[styles.input, isFocusedPassword && styles.inputFocused]}
				onFocus={() => setIsFocusedPassword(true)}
				onBlur={() => setIsFocusedPassword(false)}
				placeholder='Пароль'
				placeholderTextColor='#999'
				secureTextEntry
				onChangeText={onChangePassword}
				value={password}
			/>

			<View style={styles.footer}>
				<TouchableOpacity>
					<Text
						style={styles.footerText}
						onPress={() => navigation.navigate('PasswordRecovery')}
					>
						Забыли пароль?
					</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text
						style={styles.footerText}
						onPress={() => navigation.navigate('SignUp')}
					>
						Регистрация
					</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate('Home')}
			>
				<Text style={styles.buttonText} onPress={() => handleSignIn}>
					Войти
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default SignIn;
