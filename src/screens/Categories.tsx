import {
	Text,
	View,
	ActivityIndicator,
	TouchableOpacity,
	Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import supabase from '../config/supabaseConfig';
import { styles } from '../styles/Categories';
import { addToCart, removeFromCart, getCart } from '../utils/cartStore';
import CartButton from '../components/CartButton';
import { subscribeToCartUpdates } from '../utils/cartEventEmitter';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'> & {
	id: number;
};

const Categories: React.FC<Props> = ({ navigation, route }) => {
	const { subcategoryId } = route.params as unknown as {
		subcategoryId: number;
	};

	interface SubCategories {
		id: number;
		title: string;
		product: Product[];
	}

	interface Product {
		value: string;
		image: string;
		id: number;
		title: string;
		price: number;
	}

	const [loading, setLoading] = useState<boolean>(true);
	const [categories, setCategories] = useState<SubCategories[]>([]);
	const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
	const [productCardView, setProductCardView] = useState<boolean>(false);
	const [productId, setProductId] = useState<number>();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data, error } = await supabase
					.from('subcategories')
					.select('id, title, products(*)')
					.eq('id', subcategoryId);
				if (error) throw error;

				setCategories(
					data?.map((item: any) => ({
						id: item.id,
						title: item.title,
						product: item.products,
					})) ?? []
				);
			} catch (error) {
				console.error('Ошибка при получении категорий:', error);
			} finally {
				setLoading(false);
			}
		};

		const loadCart = async () => {
			const storedCart = await getCart();
			setCart(storedCart);
		};

		fetchCategories();
		loadCart();

		// Подписка на обновления корзины
		const unsubscribe = subscribeToCartUpdates(loadCart);

		// Отписка при размонтировании
		return () => {
			unsubscribe();
		};
	}, []);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='#0000ff' />
			</View>
		);
	}

	const SubCategories = ({
		title,
		price,
		id,
		image,
		value,
	}: {
		id: number;
		value: string;
		title: string;
		price: string;
		image: string;
	}) => {
		// Получаем количество товара из глобального состояния `cart`
		const quantity = cart.find(item => item.id === id)?.quantity || 0;

		const handleAddToCart = async () => {
			await addToCart({ id, title, price, image });
			const updatedCart = await getCart(); // Загружаем обновленные данные корзины
			setCart(updatedCart);
		};

		const handleRemoveFromCart = async () => {
			if (quantity > 0) {
				await removeFromCart(id);
				const updatedCart = await getCart(); // Загружаем обновленные данные корзины
				setCart(updatedCart);
			}
		};

		return (
			<View style={styles.productCard}>
				<TouchableOpacity
					onPress={() => {
						setProductCardView(true);
						setProductId(id);
					}}
				>
					<View style={styles.imageContainer}>
						<Image source={{ uri: image }} style={styles.image} />
					</View>
					<Text style={styles.productTitle}>{title}</Text>
					<Text style={styles.valueText}>{value}</Text>
				</TouchableOpacity>

				{quantity > 0 ? (
					<View style={styles.counterNotZero}>
						<TouchableOpacity
							onPress={handleRemoveFromCart}
							style={styles.addRemoveButton}
						>
							<Ionicons
								name='remove'
								size={20}
								color='#fff'
								style={{ margin: 2 }}
							/>
						</TouchableOpacity>
						<Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
							{quantity}
						</Text>
						<TouchableOpacity
							onPress={handleAddToCart}
							style={styles.addRemoveButton}
						>
							<Ionicons
								name='add'
								size={20}
								color='#fff'
								style={{ margin: 2 }}
							/>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.counterZero}>
						<Text style={{ color: '#FF7269', fontWeight: '700', fontSize: 14 }}>
							~{price} ₽
						</Text>
						<TouchableOpacity
							onPress={handleAddToCart}
							style={styles.zeroButton}
						>
							<Ionicons
								name='add'
								size={20}
								color='#FF7269'
								style={{ margin: 2 }}
							/>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	};

	return (
		<GestureHandlerRootView>
			<StatusBar style='dark' backgroundColor='#fff' />
			<SafeAreaProvider>
				<SafeAreaView style={styles.container}>
					<View style={styles.appbar}>
						<Ionicons
							name='arrow-back'
							size={20}
							color='black'
							onPress={() => navigation.goBack()}
							style={{ marginRight: 10 }}
						/>
						{categories.map(category => (
							<Text key={category.id} style={styles.title}>
								{category.title}
							</Text>
						))}
					</View>

					<FlatList
						numColumns={3}
						data={categories.flatMap(category => category.product)}
						renderItem={({ item }) => (
							<SubCategories
								title={item.title}
								price={item.price.toString()}
								id={item.id}
								image={item.image}
								value={item.value}
							/>
						)}
						keyExtractor={item => item.id.toString()}
					/>
					{productCardView && (
						<ProductCard
							productId={productId}
							setProductCardView={setProductCardView}
						/>
					)}
					{/* Показываем кнопку корзины только если в ней есть товары */}
					{cart.length > 0 && <CartButton />}
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

export default Categories;
