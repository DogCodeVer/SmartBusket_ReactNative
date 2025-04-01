import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: '#FFFFFF',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchbar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F7F7F7',
		borderRadius: 16,
		paddingHorizontal: 12,
		height: 50,
	},
	icon: {
		marginRight: 6,
		color: '#878B93',
	},
	input: {
		flex: 1,
		fontSize: 14,
		fontWeight: 500,
	},
	title: {
		fontSize: 20,
		fontWeight: 700,
		marginBottom: 10,
	},
	categoryBlock: {
		marginTop: 16,
		flexDirection: 'column',
	},
	subcategoryBlock: {
		width: '30%', // Или другой размер блока
		height: 148, // Высота блока
		backgroundColor: '#f5f5f5', // Цвет фона
		borderRadius: 10,
		marginRight: 10,
		marginBottom: 10,
		justifyContent: 'space-between', // Распределение элементов
		alignItems: 'center', // Выравнивание по центру
	},

	image: {
		width: '100%',
		height: 100,
		resizeMode: 'cover',
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		alignSelf: 'flex-end',
	},
	title_sub: {
		fontSize: 12,
		fontWeight: 700,
		padding: 8,
		alignSelf: 'flex-start',
	},
	deliveryBox: {
		marginBottom: 12,
	},
	deliveryAddress_box: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	counterNotZero: {
		maxHeight: 40,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: '#3FBD00',
		borderRadius: 16,
		padding: 8,
	},

	addRemoveButton: {
		backgroundColor: '#FFFFFF26',
		borderRadius: 50,
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
		backgroundColor: '#3FBD0026',
		borderRadius: 50,
	},
});
