import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	cartButton: {
		position: 'absolute',
		bottom: 0,
		margin: 20,
		paddingVertical: 14,
		paddingHorizontal: 20,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#3FBD00',
		borderRadius: 8,
	},
	text: { fontWeight: 700, fontSize: 16, color: '#fff' },
});
