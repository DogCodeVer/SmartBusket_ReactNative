import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		paddingLeft: 24,
		paddingRight: 24,
		backgroundColor: '#FFFFFF',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	appbar: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	productCard: {
		width: '33%',
		paddingTop: 10,
		paddingRight: 10,
		justifyContent: 'space-evenly',
	},

	productTitle: {
		flex: 1, // Занимает доступное пространство
		justifyContent: 'center', // Центрирует текст
		textAlign: 'left',
		fontSize: 12,
		fontWeight: '700',
		paddingTop: 4,
	},

	valueText: {
		color: '#878B93',
		fontWeight: '700',
		fontSize: 12,
		paddingVertical: 4,
	},
	imageContainer: {
		flex: 1,
		justifyContent: 'flex-end', // Прижимает изображение вниз
		alignItems: 'center', // Выравнивает изображение по центру
		backgroundColor: '#F7FAFF',
		borderRadius: 16,
		paddingHorizontal: 10,
		paddingTop: 16,
		paddingBottom: 6,
	},

	image: {
		width: 90,
		height: 90,
		resizeMode: 'contain', // Чтобы изображение сохраняло пропорции
	},
	counterZero: {
		maxHeight: 40,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		backgroundColor: '#2D323A0D',
		borderRadius: 16,
		padding: 8,
	},
	zeroButton: {
		backgroundColor: '#FF726926',
		borderRadius: 50,
	},
	addRemoveButton: {
		backgroundColor: '#FFFFFF26',
		borderRadius: 50,
	},
	counterNotZero: {
		maxHeight: 40,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: '#FF7269',
		borderRadius: 16,
		padding: 8,
	},
	subCategory: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	subCategory_item_unselect: {
		backgroundColor: '#F7FAFF',
	},
});
