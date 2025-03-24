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

import { styles } from '../styles/PasswordRecovery';

type Props = NativeStackScreenProps<RootStackParamList, 'PasswordRecovery'>;

const PasswordRecovery: React.FC<Props> = ({ navigation }) => {
	const [email, onChangeEmail] = React.useState('');
	const [isFocusedEmail, setIsFocusedEmail] = React.useState(false);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Забыли пароль?</Text>

			<TextInput
				style={[styles.input, isFocusedEmail && styles.inputFocused]}
				onFocus={() => setIsFocusedEmail(true)}
				onBlur={() => setIsFocusedEmail(false)}
				placeholder='Email'
				placeholderTextColor='#999'
				onChangeText={onChangeEmail}
				value={email}
			/>
			<TouchableOpacity style={styles.button}>
				<Text style={styles.buttonText}>Отправить ссылку</Text>
			</TouchableOpacity>
		</View>
	);
};

export default PasswordRecovery;
