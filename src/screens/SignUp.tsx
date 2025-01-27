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

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp: React.FC<Props> = ({ navigation }) => {
	const [email, onChangeEmail] = React.useState('');
	const [password, onChangePassword] = React.useState('');
	const [passwordConfim, onChangePasswordConfim] = React.useState('');
	const [isFocusedPassword, setIsFocusedPassword] = React.useState(false);
	const [isFocusedEmail, setIsFocusedEmail] = React.useState(false);
	const [isFocusedPasswordConfim, setIsFocusedPasswordConfim] =
		React.useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Регистрация</Text>

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

			<TextInput
				style={[styles.input, isFocusedPasswordConfim && styles.inputFocused]}
				onFocus={() => setIsFocusedPasswordConfim(true)}
				onBlur={() => setIsFocusedPasswordConfim(false)}
				placeholder='Подтвердите пароль'
				placeholderTextColor='#999'
				secureTextEntry
				onChangeText={onChangePasswordConfim}
				value={passwordConfim}
			/>

			<View style={styles.footer}>
				<TouchableOpacity>
					<Text
						style={styles.footerText}
						onPress={() => navigation.navigate('SignIn')}
					>
						У вас уже есть аккаунт?
					</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate('SignIn')}
			>
				<Text style={styles.buttonText}>Зарегистрироваться</Text>
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
		elevation: 6.3, // Для тени на Android
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
		justifyContent: 'center',
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

export default SignUp;
