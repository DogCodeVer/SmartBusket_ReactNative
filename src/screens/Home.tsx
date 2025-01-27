import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<Props> = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Экран с категорями</Text>
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
});

export default Home;
