import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
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

	imageContainerBS: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		// marginRight: 20,
		// marginLeft: 20,
		// marginTop: 20,
		padding: 15,
		width: '100%', // Ширина контейнера
		height: 370, // Можно задать фиксированную высоту или использовать 'flex' для адаптивности
		position: 'relative', // Для размещения кнопки поверх изображения
	},
	divideLine: {
		height: 1,

		backgroundColor: '#878b9380',

		marginVertical: 10,
	},
	image: {
		width: '100%', // Растягивает изображение по ширине контейнера
		height: '100%', // Растягивает изображение по высоте контейнера
		resizeMode: 'contain',
	},
	productInfo: {
		backgroundColor: '#fff',
		paddingHorizontal: 24,
		paddingTop: 14,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: -4, // Тень сверху
		},
		shadowOpacity: 0.4,
		shadowRadius: 8,
		elevation: 8, // Для Android
		marginTop: -10,
	},
	addCartBlock: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: -24,
		paddingHorizontal: 24,
		paddingVertical: 16,
		backgroundColor: '#3FBD00',
		alignItems: 'center',
	},
	addCartButton: {
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 32,
	},

	textTilte: {
		fontSize: 24,
		fontWeight: 900,
		color: '#3F3F3F',
	},
	textTilteGrey: {
		fontSize: 24,
		fontWeight: 900,
		color: '#878B93',
	},
	textTitleSmall: {
		fontSize: 12,
		fontWeight: 700,
		color: '#878B93',
	},
	textBGU: {
		fontSize: 18,
		fontWeight: 700,
		color: '#3F3F3F',
	},
	textDefault: {
		fontSize: 12,
		fontWeight: 600,
		color: '#3F3F3F',
	},
	priceText: {
		fontSize: 24,
		fontWeight: 700,
		color: '#FFFFFF',
	},
	buttonText: {
		color: '#3FBD00',
		fontSize: 14,
		fontWeight: '700',
	},
	quantityPicker: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 32,
		paddingHorizontal: 12,
	},
	textQuantity: {
		fontSize: 14,
		fontWeight: 700,
		color: '#3FBD00',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	quantityButton: {
		borderRadius: 32,
		backgroundColor: '#3FBD0026',
		padding: 4,
	},
});
