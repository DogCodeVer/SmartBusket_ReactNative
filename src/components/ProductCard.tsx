import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ProductCard';

import supabase from '../config/supabaseConfig';
import { addToCart, getCart, removeFromCart } from '../utils/cartStore';

type ProductCardProps = {
	productId: string | undefined;
	setProductCardView: (value: boolean) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
	productId,
	setProductCardView,
}) => {
	interface Product {
		plu: number;
		name: string;
		image_links: {
			small: string[];
			normal: string[];
		};
		uom: string;
		step: string;
		rating: {
			rating_average: number;
			rates_count: number;
		};
		promo: null | string;
		prices: {
			value: string;
			placement_type: string;
		}[];
		labels: {
			label: string;
			bg_color: string;
			text_color: string;
		}[];
		property_clarification: string;
		has_age_restriction: boolean;
		stock_limit: string;
		description: string;
		description_md: string;
		description_html: null | string;
		nutrients: {
			value: string;
			text: string;
		}[];
		attributes: {
			name: string;
			value: string;
			uom: string | null;
		}[];
		ingredients: string;
		ingredients_html: null | string;
		is_available: boolean;
		is_various_manufacturers: boolean;
	}

	const [loading, setLoading] = useState<boolean>(true);
	const [product, setProduct] = useState<Product>();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	// Загрузка данных продукта
	const fetchProduct = async (productId: string) => {
		try {
			const response = await fetch(
				`http://192.168.1.72:8000/parser/get_product_info/${productId}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();

			if (data) {
				setProduct(data);
			} else {
				setProduct(undefined);
			}
		} catch (error) {
			console.error('Error fetching product:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (productId !== undefined) {
			fetchProduct(productId.toString());
		}
	}, [productId]);

	// Загрузка корзины при монтировании и обновлении корзины
	useEffect(() => {
		const loadCart = async () => {
			const cartData = await getCart();
			setCart(cartData);
		};
		loadCart();
	}, []);

	const quantity =
		cart.find(item => item.id === Number(productId))?.quantity || 0;

	// const handleAddToCart = async () => {
	// 	if (product?.id !== undefined) {
	// 		await addToCart({
	// 			id: product.id,
	// 			title: product.title,
	// 			price: product.price,
	// 			image: product.image,
	// 			value: product.value,
	// 		});
	// 		const updatedCart = await getCart();
	// 		setCart(updatedCart);
	// 	}
	// };

	const handleRemoveFromCart = async () => {
		if (quantity > 0 && product?.plu !== undefined) {
			await removeFromCart(product.plu);
			const updatedCart = await getCart();
			setCart(updatedCart);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='#0000ff' />
			</View>
		);
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<BottomSheet
				ref={bottomSheetRef}
				onChange={handleSheetChanges}
				style={styles.viewStyle}
			>
				<BottomSheetView>
					<View style={styles.imageContainerBS}>
						<Image
							source={{ uri: product?.image_links.normal[0] }}
							style={styles.image}
						/>
						<TouchableOpacity
							onPress={() => setProductCardView(false)}
							style={{
								position: 'absolute',
								right: 10,
								top: 10,
								backgroundColor: '#FF726926',
								borderRadius: 50,
								padding: 3,
							}}
						>
							<Ionicons name='close' size={20} color='#FF7269' />
						</TouchableOpacity>
					</View>
					<View style={styles.productInfo}>
						<Text style={styles.textTilte}>{product?.name}</Text>
						<Text style={styles.textTilteGrey}>
							{product?.property_clarification}
						</Text>
						<View style={styles.divideLine} />
						<View>
							<Text style={styles.textTitleSmall}>На 100 г</Text>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<View>
									<Text style={styles.textBGU}>
										{product?.nutrients[3].value}
									</Text>
									<Text style={styles.textTitleSmall}>ккал</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>
										{product?.nutrients[0].value}
									</Text>
									<Text style={styles.textTitleSmall}>белки</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>
										{product?.nutrients[1].value}
									</Text>
									<Text style={styles.textTitleSmall}>жиры</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>
										{product?.nutrients[2].value}
									</Text>
									<Text style={styles.textTitleSmall}>углеводы</Text>
								</View>
							</View>
							<View style={styles.divideLine} />
						</View>
						<View style={{ marginBottom: 10 }}>
							<Text style={styles.textTitleSmall}>Состав</Text>
							<Text style={styles.textDefault}>{product?.ingredients}</Text>
						</View>
						<View style={{ marginBottom: 20 }}>
							<Text style={styles.textTitleSmall}>Срок и условия хранения</Text>
							<Text style={styles.textDefault}>
								{product?.attributes[1].value}, {product?.attributes[2].value}
							</Text>
						</View>
						<View style={styles.addCartBlock}>
							<Text style={styles.priceText}>{product?.prices[0].value} ₽</Text>
							{quantity === 0 ? (
								<TouchableOpacity
									style={styles.addCartButton}
									// onPress={handleAddToCart}
								>
									<Text style={styles.buttonText}>Добавить в корзину</Text>
								</TouchableOpacity>
							) : (
								<View style={styles.quantityPicker}>
									<TouchableOpacity
										onPress={handleRemoveFromCart}
										style={styles.quantityButton}
									>
										<Ionicons name='remove' size={24} color='#FF7269' />
									</TouchableOpacity>
									<Text style={styles.textQuantity}>{quantity}</Text>
									<TouchableOpacity
										// onPress={handleAddToCart}
										style={styles.quantityButton}
									>
										<Ionicons name='add' size={24} color='#FF7269' />
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</GestureHandlerRootView>
	);
};

export default ProductCard;
