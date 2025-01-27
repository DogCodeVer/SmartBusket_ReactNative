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
type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn: React.FC<Props> = ({ navigation }) => {
	const [email, onChangeEmail] = React.useState('');
	const [password, onChangePassword] = React.useState('');
	const [isFocusedPassword, setIsFocusedPassword] = React.useState(false);
	const [isFocusedEmail, setIsFocusedEmail] = React.useState(false);

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
				<Text
					style={styles.buttonText}
					onPress={() => navigation.navigate('Home')}
				>
					Войти
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#3F3F3F',
	},
	input: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderColor: '#2D323A1A',
		borderRadius: 12,
		backgroundColor: '#fff',
		shadowColor: '#FF7269',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 6.3,
		marginBottom: 15,
		paddingHorizontal: 15,
		fontSize: 14,
	},
	button: {
		width: '100%',
		height: 50,
		backgroundColor: '#FF7269',
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 4,
		width: '100%',
	},
	footerText: {
		fontSize: 14,
		color: '#FF7269',
		textDecorationLine: 'none',
	},
	inputFocused: {
		borderColor: '#FF7269', // Цвет границы при фокусе
	},
});

export default SignIn;
