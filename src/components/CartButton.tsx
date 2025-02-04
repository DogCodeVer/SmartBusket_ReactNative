import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/CartButton';
import { getCartTotal } from '../utils/cartStore';
import { subscribeToCartUpdates } from '../utils/cartEventEmitter';

const CartButton: React.FC = () => {
	const [cartTotal, setCartTotal] = useState(0);

	const fetchTotal = async () => {
		const total = await getCartTotal();
		setCartTotal(total);
	};

	useEffect(() => {
		// Первоначальная загрузка суммы корзины
		fetchTotal();

		// Подписываемся на события обновления корзины
		const unsubscribe = subscribeToCartUpdates(fetchTotal);

		// Отписка при размонтировании
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<TouchableOpacity style={styles.cartButton}>
			<Text style={styles.text}>Корзина</Text>
			<Text style={styles.text}>{cartTotal} ₽</Text>
		</TouchableOpacity>
	);
};

export default CartButton;
