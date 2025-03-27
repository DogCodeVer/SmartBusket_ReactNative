import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1000,
	},
	viewStyle: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 18,
		},
		shadowOpacity: 0.6,
		shadowRadius: 12,
		elevation: 16,
	},
	addressBox: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 20,
	},
	addAddressBox: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 16,
	},
});
