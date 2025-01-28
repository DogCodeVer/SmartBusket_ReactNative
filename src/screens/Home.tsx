import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import supabase from '../config/supabaseConfig';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
		console.log('categories', JSON.stringify(categories, null, 2));
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
					<SubCategories title={item.title} image={item.image} id={''} />
				)}
				keyExtractor={item => item.id}
				horizontal
			/>
		</View>
	);

	type SubCategoriesProps = {
		id: string;
		title: string;
		image: string;
	};
	const SubCategories = ({ title, image }: SubCategoriesProps) => (
		<View>
			<Image source={{ uri: image }} />
			<Text>{title}</Text>
		</View>
	);

	return (
		<GestureHandlerRootView>
			<SafeAreaProvider>
				<SafeAreaView style={styles.container}>
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
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	listContainer: {
		marginTop: 10,
	},
	categoryBlock: {
		alignItems: 'center',
		marginHorizontal: 10,
	},
	image: {
		width: 80,
		height: 80,
		borderRadius: 10,
	},
	categoryName: {
		marginTop: 5,
		fontSize: 14,
	},
});

export default Home;
