import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: '#fff',
	},
	inputFocused: {
		borderColor: '#3FBD00', // Цвет границы при фокусе
	},
	searchIcon: {
		padding: 10,
	},
	input: {
		paddingTop: 10,
		marginRight: 10,
		paddingBottom: 10,
		paddingLeft: 0,
		backgroundColor: '#fff',
		color: '#424242',
		flex: 1,
	},

	searchSection: {
		flexDirection: 'row',
		// justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 10,
	},
	detectLocation: {
		flexDirection: 'row',
		paddingTop: 10,
		alignItems: 'center',
	},
	appbar: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	searchResults: {
		borderWidth: 1,
		borderTopWidth: 0,
		borderColor: '#E5E5E5',
		borderBottomEndRadius: 10,
		borderBottomStartRadius: 10,
		marginTop: -8,
		paddingTop: 24,
		paddingHorizontal: 12,
		paddingBottom: 12,
	},
	button: {
		width: '100%',
		height: 50,
		backgroundColor: '#3FBD00',
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
});
