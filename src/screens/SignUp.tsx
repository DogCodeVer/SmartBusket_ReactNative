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

import { styles } from '../styles/SignUp';

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

export default SignUp;
