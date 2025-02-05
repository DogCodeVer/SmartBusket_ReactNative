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
	productId: number | undefined;
	setProductCardView: (value: boolean) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
	productId,
	setProductCardView,
}) => {
	interface Product {
		id: number;
		title: string;
		value: string;
		price: string;
		image: string;
	}

	interface ProductDesc {
		BGU: {
			calories: number;
			proteins: number;
			fats: number;
			carbohydrates: number;
		};
		compound: string;
		condition: string;
	}

	const [loading, setLoading] = useState<boolean>(true);
	const [product, setProduct] = useState<Product>();
	const [productDesc, setProductDesc] = useState<ProductDesc>();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	// Загрузка данных продукта
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const { data, error } = await supabase
					.from('products')
					.select(
						'id, title, value, price, image, product_desc(BGU, compound, condition)'
					)
					.eq('id', productId);
				if (error) {
					throw error;
				}
				if (data && data.length > 0) {
					const item = data[0];
					setProduct({
						id: item.id,
						title: item.title,
						value: item.value,
						price: item.price,
						image: item.image,
					});
					const BGU = item.product_desc[0]?.BGU || {};
					setProductDesc({
						BGU: {
							calories: parseFloat(BGU.calories) || 0,
							proteins: parseFloat(BGU.proteins) || 0,
							fats: parseFloat(BGU.fats) || 0,
							carbohydrates: parseFloat(BGU.carbohydrates) || 0,
						},
						compound: item.product_desc[0]?.compound,
						condition: item.product_desc[0]?.condition,
					});
				} else {
					setProduct(undefined);
				}
			} catch (error) {
				console.error('Error fetching product:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, []);

	// Загрузка корзины при монтировании и обновлении корзины
	useEffect(() => {
		const loadCart = async () => {
			const cartData = await getCart();
			setCart(cartData);
		};
		loadCart();
	}, []);

	const quantity = cart.find(item => item.id === productId)?.quantity || 0;

	const handleAddToCart = async () => {
		if (product?.id !== undefined) {
			await addToCart({
				id: product.id,
				title: product.title,
				price: product.price,
				image: product.image,
				value: product.value,
			});
			const updatedCart = await getCart();
			setCart(updatedCart);
		}
	};

	const handleRemoveFromCart = async () => {
		if (quantity > 0 && product?.id !== undefined) {
			await removeFromCart(product.id);
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
						<Image source={{ uri: product?.image }} style={styles.image} />
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
						<Text style={styles.textTilte}>{product?.title}</Text>
						<Text style={styles.textTilteGrey}>{product?.value}</Text>
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
										{productDesc?.BGU.calories}
									</Text>
									<Text style={styles.textTitleSmall}>ккал</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>
										{productDesc?.BGU.proteins}
									</Text>
									<Text style={styles.textTitleSmall}>белки</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>{productDesc?.BGU.fats}</Text>
									<Text style={styles.textTitleSmall}>жиры</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>
										{productDesc?.BGU.carbohydrates}
									</Text>
									<Text style={styles.textTitleSmall}>углеводы</Text>
								</View>
							</View>
							<View style={styles.divideLine} />
						</View>
						<View style={{ marginBottom: 10 }}>
							<Text style={styles.textTitleSmall}>Состав</Text>
							<Text style={styles.textDefault}>{productDesc?.compound}</Text>
						</View>
						<View style={{ marginBottom: 20 }}>
							<Text style={styles.textTitleSmall}>Срок и условия хранения</Text>
							<Text style={styles.textDefault}>{productDesc?.condition}</Text>
						</View>
						<View style={styles.addCartBlock}>
							<Text style={styles.priceText}>{product?.price} ₽</Text>
							{quantity === 0 ? (
								<TouchableOpacity
									style={styles.addCartButton}
									onPress={handleAddToCart}
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
										onPress={handleAddToCart}
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
