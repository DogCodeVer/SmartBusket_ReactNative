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
		width: 108, // Или другой размер блока
		height: 148, // Высота блока
		backgroundColor: '#f5f5f5', // Цвет фона
		borderRadius: 10,
		marginRight: 10,
		marginBottom: 10,
		justifyContent: 'space-between', // Распределение элементов
		alignItems: 'center', // Выравнивание по центру
	},

	image: {
		width: 108,
		height: 112,
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
});
