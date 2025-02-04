import React, { useEffect, useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface Category {
	id: string;
	title: string;
	subcategories: SubCategories[] | null;
}

interface SubCategories {
	id: string;
	title: string;
	category_id: string;
	image: string;
}

const Home: React.FC<Props> = ({ navigation }) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchText, setSearchText] = useState('');
	const [cartHasItems, setCartHasItems] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data, error } = await supabase
					.from('categories')
					.select('id, title, subcategories (id, title, category_id, image)');
				if (error) {
					throw error;
				}
				setCategories(
					(data ?? []).map(category => ({
						...category,
						subcategories: category.subcategories ?? [],
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
					<SubCategories title={item.title} image={item.image} id={item.id} />
				)}
				keyExtractor={item => item.id}
				numColumns={3}
			/>
		</View>
	);

	type SubCategoriesProps = {
		id: string;
		title: string;
		image: string;
	};
	const SubCategories = ({ title, image, id }: SubCategoriesProps) => (
		<TouchableOpacity
			style={styles.subcategoryBlock}
			onPress={() =>
				navigation.navigate('Categories', { subcategoryId: Number(id) })
			}
		>
			<Text style={styles.title_sub}>{title}</Text>
			<Image source={{ uri: image }} style={styles.image} />
		</TouchableOpacity>
	);

	return (
		<GestureHandlerRootView>
			<StatusBar barStyle={'dark-content'} backgroundColor='#fff' />
			<SafeAreaProvider>
				<SafeAreaView style={styles.container}>
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
								title={item.title}
								subcategories={item.subcategories ?? []}
							/>
						)}
						keyExtractor={item => item.id}
					/>

					{/* Показываем кнопку корзины только если в корзине есть товары */}
					{cartHasItems && <CartButton />}
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

export default Home;
