import React, { useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ProductCard';

type ProductCardProps = {
	productId: number | undefined;
	setProductCardView: (value: boolean) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
	productId,
	setProductCardView,
}) => {
	const bottomSheetRef = useRef<BottomSheet>(null);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

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
							source={{
								uri: 'https://ecqbyvpsbwrihodwwach.supabase.co/storage/v1/object/sign/subcategories_image/testProduct.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzdWJjYXRlZ29yaWVzX2ltYWdlL3Rlc3RQcm9kdWN0LnBuZyIsImlhdCI6MTczODI0NTE4MiwiZXhwIjoxNzY5NzgxMTgyfQ.-WpyqPGPhbS7IOOonoEaudAXTEKvH3POejnjV6VfhEc',
							}}
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
						<Text style={styles.textTilte}>
							Молоко топленое Простоквашино, 3.2%
						</Text>
						<Text style={styles.textTilteGrey}>930 мл</Text>
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
									<Text style={styles.textBGU}>0</Text>
									<Text style={styles.textTitleSmall}>ккал</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>0</Text>
									<Text style={styles.textTitleSmall}>белки</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>0</Text>
									<Text style={styles.textTitleSmall}>жиры</Text>
								</View>
								<View>
									<Text style={styles.textBGU}>0</Text>
									<Text style={styles.textTitleSmall}>углеводы</Text>
								</View>
							</View>
							<View style={styles.divideLine} />
						</View>
						<View style={{ marginBottom: 10 }}>
							<Text style={styles.textTitleSmall}>Состав</Text>
							<Text style={styles.textDefault}>
								Очищенная и умягченная вода, белки, жиры, углеводы, минералы,
								витамины, ароматизатор,
							</Text>
						</View>
						<View style={{ marginBottom: 20 }}>
							<Text style={styles.textTitleSmall}>Срок и условия хранения</Text>
							<Text style={styles.textDefault}>
								3 месяца, При температуре от 0°C до +6°С
							</Text>
						</View>
						<View style={styles.addCartBlock}>
							<Text style={styles.priceText}>90 ₽</Text>
							<TouchableOpacity style={styles.addCartButton}>
								<Text style={styles.buttonText}>Добавить в корзину</Text>
							</TouchableOpacity>
						</View>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</GestureHandlerRootView>
	);
};

export default ProductCard;
