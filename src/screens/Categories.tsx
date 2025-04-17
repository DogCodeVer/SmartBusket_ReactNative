import {Text, View, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
import React, {useEffect, useState} from 'react'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../navigation/AppNavigation'
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler'
import {StatusBar} from 'expo-status-bar'
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import {Ionicons} from '@expo/vector-icons'
import ProductCard from '../components/ProductCard'
import {styles} from '../styles/Categories'
import {addToCart, removeFromCart, getCart} from '../utils/cartStore'
import CartButton from '../components/CartButton'
import {subscribeToCartUpdates} from '../utils/cartEventEmitter'
import FilterCategory from '../components/FilterCategory'
import Constants from 'expo-constants'

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'> & {
  id: number
}

const Categories: React.FC<Props> = ({navigation, route}) => {
  const {subcategoryId} = route.params as unknown as {
    subcategoryId: string
  }

  interface Product {
    plu: number
    name: string
    image_links: {
      small: string[]
      normal: string[]
    }
    uom: string
    step: string
    rating: {
      rating_average: number
      rates_count: number
    }
    promo: string | null
    prices: {
      regular: string
      discount: string
      cpd_promo_price: string | null
    }
    labels: {
      label: string
      bg_color: string
      text_color: string
    }[]
    property_clarification: string
    has_age_restriction: boolean
    stock_limit: string
  }
  interface SubCategory {
    id: string
    name: string
    description: string | null
    description_html: string | null
    image_link: string
    gradient_start: string
    gradient_end: string
    title_color: string
    advert: string | null
    categories_tags: {
      id: string
      name: string
    }[]
    additional_icons: {
      type: string
      url: string
    }[]
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<Product[]>([])
  const [cart, setCart] = useState<{id: number; quantity: number}[]>([])
  const [productCardView, setProductCardView] = useState<boolean>(false)
  const [productId, setProductId] = useState<number>()
  const [subCategory, setSubCategory] = useState<SubCategory>()
  const [selectFilterView, setSelectFilterView] = useState<boolean>(false)
  const [subCategorySelect, setSubCategorySelect] = useState<String>()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://212.193.26.110:8000/parser/get_products/${subcategoryId}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: Product[] = await response.json()
        setCategories(data) ?? []
      } catch (error) {
        console.error('Ошибка при получении категорий:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchSubCategory = async () => {
      try {
        const response = await fetch(
          `http://212.193.26.110:8000/parser/get_category/get_sub_categories/${subcategoryId}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        } else {
          const data: SubCategory = await response.json()
          setSubCategory(data)
        }
      } catch (error) {
        console.error('Ошибка при получении подкатегории:', error)
      }
    }

    const loadCart = async () => {
      const storedCart = await getCart()
      setCart(storedCart)
    }

    fetchProduct()
    fetchSubCategory()
    loadCart()

    // Подписка на обновления корзины
    const unsubscribe = subscribeToCartUpdates(loadCart)

    // Отписка при размонтировании
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!subCategorySelect || selectFilterView) return
    const fetchProductBySubcategory = async () => {
      try {
        const response = await fetch(
          `http://212.193.26.110:8000/parser/get_products/${subCategorySelect}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: Product[] = await response.json()
        setCategories(data) ?? []
      } catch (error) {
        console.error('Ошибка при получении категорий:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProductBySubcategory()
  }, [subCategorySelect])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  const SubCategories = ({
    title,
    price,
    id,
    image,
    value,
  }: {
    id: number
    value: string
    title: string
    price: string
    image: string
  }) => {
    // Получаем количество товара из глобального состояния `cart`
    const quantity = cart.find((item) => item.id === id)?.quantity || 0

    const handleAddToCart = async () => {
      await addToCart({id, title, price, image, value})
      const updatedCart = await getCart() // Загружаем обновленные данные корзины
      setCart(updatedCart)
    }

    const handleRemoveFromCart = async () => {
      if (quantity > 0) {
        await removeFromCart(id)
        const updatedCart = await getCart() // Загружаем обновленные данные корзины
        setCart(updatedCart)
      }
    }

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          onPress={() => {
            setProductCardView(true)
            setProductId(id)
          }}>
          <View style={styles.imageContainer}>
            <Image source={{uri: image}} style={styles.image} />
          </View>
          <Text style={styles.productTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.valueText}>{value}</Text>
        </TouchableOpacity>

        {quantity > 0 ? (
          <View style={styles.counterNotZero}>
            <TouchableOpacity onPress={handleRemoveFromCart} style={styles.addRemoveButton}>
              <Ionicons name="remove" size={20} color="#fff" style={{margin: 2}} />
            </TouchableOpacity>
            <Text style={{color: '#FFFFFF', fontWeight: '700', fontSize: 14}}>{quantity}</Text>
            <TouchableOpacity onPress={handleAddToCart} style={styles.addRemoveButton}>
              <Ionicons name="add" size={20} color="#fff" style={{margin: 2}} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.counterZero}>
            <Text style={{color: '#3FBD00', fontWeight: '700', fontSize: 14}}>
              ~{price.slice(0, -3)} ₽
            </Text>
            <TouchableOpacity onPress={handleAddToCart} style={styles.zeroButton}>
              <Ionicons name="add" size={20} color="#3FBD00" style={{margin: 2}} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  return (
    <GestureHandlerRootView>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.appbar}>
            <Ionicons
              name="arrow-back"
              size={20}
              color="black"
              onPress={() => navigation.goBack()}
              style={{marginRight: 10}}
            />
            <Text style={styles.title}>{subCategory?.name}</Text>
          </View>
          <View style={styles.subCategory}>
            {/* <TouchableOpacity
							style={{ paddingRight: 10 }}
							onPress={() => {
								setSelectFilterView(true);
							}}
						>
							<Ionicons name='funnel-outline' size={20} color='black' />
						</TouchableOpacity> */}
            <FlatList
              data={subCategory?.categories_tags}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.subCategory_item_unselect}
                  onPress={() => {
                    {
                      console.log(item.id), setSubCategorySelect(item.id)
                    }
                  }}>
                  <Text style={styles.subCategory_text_unselect}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal={true}
            />
          </View>

          <FlatList
            numColumns={3}
            data={categories}
            renderItem={({item}) => (
              <SubCategories
                title={item.name}
                price={item.prices.regular.toString()}
                id={item.plu}
                image={item.image_links.small[0]}
                value={item.property_clarification}
              />
            )}
            keyExtractor={(item) => item.plu.toString()}
          />
          {productCardView && (
            <ProductCard productId={productId} setProductCardView={setProductCardView} />
          )}
          {/* Показываем кнопку корзины только если в ней есть товары */}
          {cart.length > 0 && <CartButton />}
          {selectFilterView && <FilterCategory setSelectFilterView={setSelectFilterView} />}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default Categories
