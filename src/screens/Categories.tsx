import {
	Text,
	View,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	Image,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';

import supabase from '../config/supabaseConfig';

import { styles } from '../styles/Categories';

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
		id: number;
		title: string;
		price: number;
	}

	const [loading, setLoading] = useState<boolean>(true);
	const [categories, setCategories] = useState<SubCategories[]>([]);
	const [productCardView, setProductCardView] = useState<boolean>(false);
	const [productId, setProductId] = useState<number>();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data, error } = await supabase
					.from('subcategories')
					.select('id, title, products(*)')
					.eq('id', subcategoryId);
				if (error) {
					throw error;
				}
				setCategories(
					data?.map((item: any) => ({
						id: item.id,
						title: item.title,
						product: item.products,
					})) ?? []
				);
				console.log(data);
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoading(false);
			}
		};
		// console.log('categories', JSON.stringify(categories, null, 2));

		fetchCategories();
	}, []);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='#0000ff' />
			</View>
		);
	}

	type SubCategoriesProps = {
		id: number;
		title: string;
		price: string;
		count?: number;
	};

	const SubCategories = ({
		title,
		price,
		id,
		count = 0,
	}: SubCategoriesProps) => {
		const [quantity, setQuantity] = useState(count);

		const increaseCount = () => setQuantity(prev => prev + 1);
		const decreaseCount = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));
		return (
			<TouchableOpacity
				style={styles.productCard}
				onPress={() => {
					setProductCardView(true);
					setProductId(id);
				}}
			>
				<View style={styles.imageContainer}>
					<Image
						source={{
							uri: 'https://ecqbyvpsbwrihodwwach.supabase.co/storage/v1/object/sign/subcategories_image/testProduct.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzdWJjYXRlZ29yaWVzX2ltYWdlL3Rlc3RQcm9kdWN0LnBuZyIsImlhdCI6MTczODI0NTE4MiwiZXhwIjoxNzY5NzgxMTgyfQ.-WpyqPGPhbS7IOOonoEaudAXTEKvH3POejnjV6VfhEc',
						}}
						style={styles.image}
					/>
				</View>
				<Text style={styles.productTitle}>{title}</Text>
				{quantity > 0 ? (
					<View style={styles.counterNotZero}>
						<TouchableOpacity
							onPress={decreaseCount}
							style={styles.addRemoveButton}
						>
							<Ionicons
								name='remove'
								size={20}
								color='#fff'
								style={{ margin: 2 }}
							/>
						</TouchableOpacity>
						<Text>{quantity}</Text>
						<TouchableOpacity
							onPress={increaseCount}
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
						<TouchableOpacity style={{ display: 'none' }}>
							<Ionicons name='remove-circle' size={20} color='#FF7269' />
						</TouchableOpacity>
						<Text>~{price} ₽</Text>
						<TouchableOpacity onPress={increaseCount} style={styles.zeroButton}>
							<Ionicons
								name='add'
								size={20}
								color='#FF7269'
								style={{ margin: 2 }}
							/>
						</TouchableOpacity>
					</View>
				)}
			</TouchableOpacity>
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
							/>
						)}
					/>

					{productCardView ? (
						<ProductCard
							productId={productId}
							setProductCardView={setProductCardView}
						/>
					) : null}
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

export default Categories;
