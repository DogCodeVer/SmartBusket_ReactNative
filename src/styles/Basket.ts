import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 24,
	},
	header: {
		flexDirection: 'row', // Размещаем элементы в строку
		alignItems: 'center', // Выравниваем элементы по вертикали
		justifyContent: 'center', // Центрируем текст
		position: 'relative', // Позволяет позиционировать кнопку
		paddingVertical: 10,
	},

	headerText: {
		fontSize: 18,
		fontWeight: '700',
	},

	headerBack: {
		position: 'absolute', // Абсолютное позиционирование
		right: 0, // Прижимаем кнопку к правому краю
		padding: 5, // Увеличиваем область нажатия
		backgroundColor: '#FF726926',
		borderRadius: 32,
	},
	blockInfo: {
		backgroundColor: '#FF72691A',
		padding: 16,
		borderRadius: 16,
	},
	blockInfoText: {
		fontSize: 16,
		fontWeight: '700',
	},
	blockInfoShop: {
		paddingTop: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	shopImage: { width: 70, height: 30, resizeMode: 'center' },
	textPrice: { fontSize: 16, fontWeight: '700', paddingRight: 16 },
	listContainer: {
		paddingTop: 24,
	},
	cartItems: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 16,
	},

	dotDivider: {
		height: 4,
		width: 4,
		backgroundColor: '#878B93',
		borderRadius: 32,
		marginHorizontal: 7,
	},

	productInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	quantityPicker: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FF7269',
		borderRadius: 12, // Округляем углы
		paddingHorizontal: 10, // Добавляем отступы внутри
		paddingVertical: 5,
		marginLeft: 'auto', // Прижимает к правому краю
	},
});
