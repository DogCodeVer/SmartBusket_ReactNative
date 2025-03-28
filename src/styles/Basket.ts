import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 24,
		backgroundColor: '#FFFFFF',
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		paddingVertical: 10,
	},

	headerText: {
		fontSize: 18,
		fontWeight: '700',
	},

	headerBack: {
		position: 'absolute',
		right: 0,
		padding: 8,
		backgroundColor: '#F7FAFF',
		borderRadius: 32,
	},

	blockInfo: {
		backgroundColor: '#F7FAFF',
		padding: 16,
		borderRadius: 16,
		marginBottom: 16,
	},
	blockInfoText: {
		fontSize: 16,
		fontWeight: '700',
		flexShrink: 1,
	},
	blockInfoShop: {
		paddingTop: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	shopImage: {
		width: 60,
		height: 30,
		resizeMode: 'contain',
	},

	textPrice: {
		fontSize: 16,
		fontWeight: '700',
		paddingRight: 10,
	},

	listContainer: {
		paddingTop: 16,
		flexGrow: 0,
	},

	cartItems: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 16,
		gap: 12,
	},

	productInfo: {
		flex: 1,
	},

	dotDivider: {
		height: 4,
		width: 4,
		backgroundColor: '#878B93',
		borderRadius: 32,
		marginHorizontal: 5,
	},

	quantityPicker: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#3FBD00',
		borderRadius: 32,
		paddingHorizontal: 10,
		paddingVertical: 6,
		minWidth: 90,
		justifyContent: 'space-between',
	},

	addRemoveButon: {
		backgroundColor: '#FFFFFF26',
		borderRadius: 32,
		padding: 4,
	},

	quantityText: {
		fontWeight: '700',
		fontSize: 14,
		color: '#FFFFFF',
		paddingHorizontal: 10,
	},

	itemTitle: {
		fontWeight: '600',
		fontSize: 14,
		color: '#3F3F3F',
		flexShrink: 1,
		maxWidth: 180,
	},
	totalPriceBox: {
		backgroundColor: '#F7FAFF',
		padding: 16,
		borderRadius: 16,
		marginBottom: 16,
	},
});
