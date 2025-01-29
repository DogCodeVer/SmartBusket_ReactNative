import {
	Text,
	View,
	StyleSheet,
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
import supabase from '../config/supabaseConfig';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
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
			<View style={styles.productCard}>
				<View>
					<View
						style={{
							padding: 14,
							backgroundColor: '#F7FAFF',
							borderRadius: 16,
						}}
					>
						<Image
							source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
							style={styles.image}
						/>
					</View>
					<Text>{title}</Text>
					{quantity > 0 ? (
						<View>
							<TouchableOpacity onPress={decreaseCount}>
								<Ionicons name='remove-circle' size={24} color='black' />
							</TouchableOpacity>
							<Text>{quantity}</Text>
							<TouchableOpacity onPress={increaseCount}>
								<Ionicons name='add-circle' size={24} color='black' />
							</TouchableOpacity>
						</View>
					) : (
						<View>
							<TouchableOpacity style={{ display: 'none' }}>
								<Ionicons name='remove-circle' size={24} color='black' />
							</TouchableOpacity>
							<Text>{price} руб.</Text>
							<TouchableOpacity onPress={increaseCount}>
								<Ionicons name='add-circle' size={24} color='black' />
							</TouchableOpacity>
						</View>
					)}
				</View>
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
							/>
						)}
					/>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		paddingLeft: 24,
		paddingRight: 24,
		backgroundColor: '#FFFFFF',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	appbar: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	productCard: {
		paddingTop: 10,
		paddingRight: 10,
	},
	image: {
		width: 100,
		height: 100,
	},
});

export default Categories;
