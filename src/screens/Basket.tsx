import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigation';
import { styles } from '../styles/Basket';
import { Ionicons } from '@expo/vector-icons';
import { getCart, getCartTotal, updateCartItem } from '../utils/cartStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSelectedAddress } from '../utils/addressSaved';

type Props = NativeStackScreenProps<RootStackParamList, 'Basket'>;

const Basket: React.FC<Props> = ({ navigation }) => {
	const [cart, setCart] = useState<
		{
			id: number;
			title: string;
			price: number;
			quantity: number;
			image: string;
			value: string;
		}[]
	>([]);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

	// Функция загрузки товаров из корзины
	const fetchCart = async () => {
		const cartItems = await getCart();
		const total = await getCartTotal();
		setCart(cartItems);
		setTotalPrice(total);
	};

	// Обновление количества товара
	const updateCartItemQuantity = async (id: number, change: number) => {
		const updatedCart = cart
			.map(item =>
				item.id === id
					? { ...item, quantity: Math.max(0, item.quantity + change) }
					: item
			)
			.filter(item => item.quantity > 0); // Удаляем товар, если его количество стало 0

		setCart(updatedCart);
		setTotalPrice(
			updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
		);

		await updateCartItem(id, change); // Сохраняем изменения в хранилище
	};

	// Загружаем корзину при открытии экрана
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', fetchCart);
		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		const fetchSelectedAddress = async () => {
			try {
				const address = await getSelectedAddress();
				setSelectedAddress(address);
			} catch (error) {
				console.error('Error fetching selected address:', error);
			}
		};
		fetchSelectedAddress();
	}, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
			<View style={styles.container}>
				{/* Заголовок */}
				<View style={styles.header}>
					<Text style={styles.headerText}>Корзина</Text>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.headerBack}
					>
						<Ionicons name='close' size={18} color='#62666E' />
					</TouchableOpacity>
				</View>

				{/* Информация о магазине */}
				<View style={styles.blockInfo}>
					<Text style={styles.blockInfoText}>
						Ваша корзина будет создана в этом магазине:
					</Text>
					<View style={styles.blockInfoShop}>
						<Image
							source={{
								uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Magnit_logo.png/800px-Magnit_logo.png',
							}}
							style={styles.shopImage}
						/>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.textPrice}>{Math.round(totalPrice)} ₽</Text>
							<Ionicons name='trash' size={20} color='#3FBD00CC' />
						</View>
					</View>
				</View>

				{/* Список товаров в корзине */}
				<FlatList
					style={styles.listContainer}
					data={cart}
					renderItem={({ item }) => (
						<View style={styles.cartItems}>
							{/* Изображение товара */}
							<View
								style={{
									backgroundColor: '#FFFFFF',
									borderRadius: 12,
									padding: 5,
									borderWidth: 1,
									borderColor: '#F7FAFF',
									width: 70, // Размер блока (немного больше изображения)
									height: 70,
									alignItems: 'center', // Центрируем изображение
									justifyContent: 'center',
								}}
							>
								<Image
									source={{ uri: item.image }}
									style={{
										width: '100%',
										height: '100%',
										resizeMode: 'contain',
									}}
								/>
							</View>

							{/* Информация о товаре */}
							<View style={styles.productInfo}>
								<Text style={styles.itemTitle} numberOfLines={2}>
									{item.title}
								</Text>
								<View
									style={
										styles.productInfo && {
											flexDirection: 'row',
											alignItems: 'center',
										}
									}
								>
									<Text
										style={{
											fontWeight: '500',
											fontSize: 14,
											color: '#3FBD00',
										}}
									>
										{Math.round(item.price)} ₽
									</Text>
									<View style={styles.dotDivider}></View>
									<Text
										style={{
											fontWeight: '500',
											fontSize: 14,
											color: '#878B93',
										}}
									>
										{item.value}
									</Text>
								</View>
							</View>

							{/* Кнопки управления количеством товара */}
							<View style={styles.quantityPicker}>
								<TouchableOpacity
									style={styles.addRemoveButon}
									onPress={() => updateCartItemQuantity(item.id, -1)}
								>
									<Ionicons name='remove' size={18} color='#FFFFFF' />
								</TouchableOpacity>
								<Text style={styles.quantityText}>{item.quantity}</Text>
								<TouchableOpacity
									style={styles.addRemoveButon}
									onPress={() => updateCartItemQuantity(item.id, 1)}
								>
									<Ionicons name='add' size={18} color='#FFFFFF' />
								</TouchableOpacity>
							</View>
						</View>
					)}
					keyExtractor={item => item.id.toString()}
				/>
				<View style={styles.totalPriceBox}>
					<Text
						style={{
							fontWeight: '600',
							fontSize: 14,
							color: '#3F3F3F',
							paddingBottom: 16,
							flexWrap: 'wrap',
							flexShrink: 1,
						}}
						numberOfLines={2}
					>
						{selectedAddress}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingBottom: 8,
						}}
					>
						<Text
							style={{
								fontWeight: '600',
								fontSize: 14,
								color: '#3F3F3F',
							}}
						>
							Стоимость доставки
						</Text>
						<Text
							style={{
								fontWeight: '600',
								fontSize: 14,
								color: '#3F3F3F',
							}}
						>
							200 ₽
						</Text>
					</View>
					<View
						style={{ flexDirection: 'row', justifyContent: 'space-between' }}
					>
						<Text
							style={{
								fontWeight: '700',
								fontSize: 16,
								color: '#3F3F3F',
							}}
						>
							Итого:
						</Text>
						<Text
							style={{
								fontWeight: '700',
								fontSize: 16,
								color: '#3F3F3F',
							}}
						>
							{Math.round(totalPrice) + 200} ₽
						</Text>
					</View>
					<TouchableOpacity
						style={{
							width: '100%',
							backgroundColor: '#3FBD00',
							borderRadius: 32,
							alignItems: 'center',
							paddingVertical: 14,
							marginTop: 16,
						}}
					>
						<Text
							style={{
								fontWeight: '700',
								fontSize: 16,
								color: '#fff',
							}}
						>
							К оплате
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Basket;
