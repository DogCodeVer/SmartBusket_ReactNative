import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	StatusBar,
	TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import supabase from '../config/supabaseConfig';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles/Home';
import CartButton from '../components/CartButton';
import { getCart } from '../utils/cartStore';
import { subscribeToCartUpdates } from '../utils/cartEventEmitter';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../components/selectAddress';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface AdditionalIcon {
	type: string;
	url: string;
}

interface SubCategory {
	id: string;
	name: string;
	advert: string | null;
	image_link: string;
	gradient_start: string;
	gradient_end: string;
	title_color: string;
	additional_icons: AdditionalIcon[];
}

interface Category {
	id: string;
	name: string;
	additional_icons: AdditionalIcon[];
	categories: SubCategory[];
}

const Home: React.FC<Props> = ({ navigation }) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchText, setSearchText] = useState('');
	const [cartHasItems, setCartHasItems] = useState(false);
	const bottomSheetRef = useRef<BottomSheet>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch(
					'http://192.168.1.72:8000/parser/get_category'
				);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data: Category[] = await response.json();

				setCategories(
					data.map(category => ({
						...category,
						subcategories: category.categories ?? [],
					}))
				);
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	// Функция проверки корзины
	const checkCart = async () => {
		const cart = await getCart();
		setCartHasItems(cart.length > 0);
	};

	useEffect(() => {
		// Проверяем корзину при загрузке
		checkCart();

		// Подписываемся на обновления корзины
		const unsubscribe = subscribeToCartUpdates(checkCart);

		// Отписываемся при размонтировании компонента
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

	type CategoriesProps = { title: string; subcategories: SubCategoriesProps[] };
	const Categories = ({ title, subcategories }: CategoriesProps) => (
		<View style={styles.categoryBlock}>
			<Text style={styles.title}>{title}</Text>
			<FlatList
				data={subcategories}
				renderItem={({ item }) => (
					<SubCategories
						name={item.name}
						image_link={item.image_link}
						id={item.id}
						advert={null}
						gradient_start={''}
						gradient_end={''}
						title_color={''}
						additional_icons={[]}
					/>
				)}
				keyExtractor={item => item.id}
				numColumns={3}
			/>
		</View>
	);

	type SubCategoriesProps = {
		id: string;
		name: string;
		advert: string | null;
		image_link: string;
		gradient_start: string;
		gradient_end: string;
		title_color: string;
		additional_icons: AdditionalIcon[];
	};
	const SubCategories = ({ name, image_link, id }: SubCategoriesProps) => (
		<TouchableOpacity
			style={styles.subcategoryBlock}
			onPress={() => navigation.navigate('Categories', { subcategoryId: id })}
		>
			<Text style={styles.title_sub}>{name}</Text>
			<Image source={{ uri: image_link }} style={styles.image} />
		</TouchableOpacity>
	);

	return (
		<GestureHandlerRootView>
			<StatusBar barStyle={'dark-content'} backgroundColor='#fff' />
			<SafeAreaProvider>
				<SafeAreaView style={styles.container}>
					<TouchableOpacity
						style={styles.deliveryBox}
						onPress={() => bottomSheetRef.current?.expand()}
					>
						<Text style={{ fontSize: 12, fontWeight: '600', color: '#62666E' }}>
							Куда доставить:
						</Text>
						<View style={styles.deliveryAddress_box}>
							<Text
								style={{ fontSize: 14, fontWeight: '700', color: '#3F3F3F' }}
							>
								Выбрать адрес
							</Text>
							<Ionicons name='chevron-down-outline' size={12} color='#000' />
						</View>
					</TouchableOpacity>
					<View style={styles.searchbar}>
						<Ionicons
							name='search'
							size={20}
							color='#888'
							style={styles.icon}
						/>
						<TextInput
							style={styles.input}
							placeholder='Искать товары'
							placeholderTextColor='#999'
							value={searchText}
							onChangeText={setSearchText}
						/>
					</View>
					<FlatList
						data={categories}
						renderItem={({ item }) => (
							<Categories
								title={item.name}
								subcategories={item.categories ?? []}
							/>
						)}
						keyExtractor={item => item.id}
					/>

					{/* Показываем кнопку корзины только если в корзине есть товары */}
					{cartHasItems && <CartButton />}
					<BottomSheetComponent sheetRef={bottomSheetRef} />
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

export default Home;
