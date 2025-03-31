import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
		shadowColor: '#3FBD00',
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
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 4,
		width: '100%',
	},
	footerText: {
		fontSize: 14,
		color: '#3FBD00',
		textDecorationLine: 'none',
	},
	footerText_forgotpass: {
		fontSize: 14,
		color: '#878B93',
		textDecorationLine: 'none',
	},
	inputFocused: {
		borderColor: '#3FBD00', // Цвет границы при фокусе
	},
	buttonDisabled: {
		backgroundColor: '#D3D3D3', // Светло-серый цвет фона, когда кнопка отключена
		opacity: 0.6, // Полупрозрачность
	},
});
