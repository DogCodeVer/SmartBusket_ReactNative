import React, {useEffect, useState, useCallback, useRef} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../navigation/AppNavigation'
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler'
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import {Ionicons} from '@expo/vector-icons'

import {styles} from '../styles/Home'
import CartButton from '../components/CartButton'
import {addToCart, getCart, removeFromCart} from '../utils/cartStore'
import {subscribeToCartUpdates} from '../utils/cartEventEmitter'
import SelectAddress from '../components/SelectAddress'
import {getSelectedAddress} from '../utils/addressSaved'
import ProductCard from '../components/ProductCard'
import Constants from 'expo-constants'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

interface AdditionalIcon {
  type: string
  url: string
}

interface SubCategory {
  id: string
  name: string
  advert: string | null
  image_link: string
  gradient_start: string
  gradient_end: string
  title_color: string
  additional_icons: AdditionalIcon[]
}

interface Category {
  id: string
  name: string
  additional_icons: AdditionalIcon[]
  categories: SubCategory[]
}

interface SearchResult {
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
  promo: null | string
  prices: {
    regular: string
    discount: string | null
    cpd_promo_price: string | null
  }
  labels:
    | {
        label: string
        icon_url: string | null
        bg_color: string
        text_color: string
      }[]
    | null
  property_clarification: string
  has_age_restriction: boolean
  stock_limit: string
}

const Home: React.FC<Props> = ({navigation}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchText, setSearchText] = useState('')
  const [cart, setCart] = useState<{id: number; quantity: number}[]>([])
  const [selectAddressView, setSelectAddressView] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [productCardView, setProductCardView] = useState<boolean>(false)
  const [productId, setProductId] = useState<number>()

  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`http://212.193.26.110:8000/parser/get_category`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data: Category[] = await response.json()

      if (isMounted.current) {
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const checkCart = useCallback(async () => {
    const cart = await getCart()
    if (isMounted.current) {
      setCart(cart)
    }
  }, [])

  useEffect(() => {
    checkCart()
    const unsubscribe = subscribeToCartUpdates(checkCart)
    return () => {
      unsubscribe()
    }
  }, [checkCart])

  const fetchSelectedAddress = useCallback(async () => {
    try {
      const address = await getSelectedAddress()
      if (isMounted.current) {
        setSelectedAddress(address)
      }
    } catch (error) {
      console.error('Error fetching selected address:', error)
    }
  }, [])

  useEffect(() => {
    fetchSelectedAddress()
  }, [fetchSelectedAddress])

  const fetchSearchResults = useCallback(async () => {
    if (searchText.trim().length === 0) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`http://212.193.26.110:8000/parser/search/${searchText}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data: SearchResult[] = await response.json()
      if (isMounted.current) {
        setSearchResults(data)
      }
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      if (isMounted.current) setSearchLoading(false)
    }
  }, [searchText])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [fetchSearchResults])

  type CategoriesProps = {
    title: string
    subcategories: SubCategoriesProps[]
  }
  const Categories = ({title, subcategories}: CategoriesProps) => (
    <View style={styles.categoryBlock}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={subcategories}
        renderItem={({item}) => (
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
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
    </View>
  )

  type SubCategoriesProps = {
    id: string
    name: string
    advert: string | null
    image_link: string
    gradient_start: string
    gradient_end: string
    title_color: string
    additional_icons: AdditionalIcon[]
  }
  const SubCategories = ({name, image_link, id}: SubCategoriesProps) => (
    <TouchableOpacity
      style={styles.subcategoryBlock}
      onPress={() => navigation.navigate('Categories', {subcategoryId: id})}>
      <Text style={styles.title_sub}>{name}</Text>
      <Image source={{uri: image_link}} style={styles.image} />
    </TouchableOpacity>
  )

  // Карточки товаров
  const ProductView = ({
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
      <View
        style={{
          width: '33%',
          paddingTop: 10,
          paddingRight: 10,
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={() => {
            setProductCardView(true)
            setProductId(id)
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end', // Прижимает изображение вниз
              alignItems: 'center', // Выравнивает изображение по центру
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingTop: 16,
              paddingBottom: 6,
              borderWidth: 1,
              borderColor: '#F7FAFF',
            }}>
            <Image
              source={{uri: image}}
              style={{
                width: 90,
                height: 90,
                resizeMode: 'contain', // Чтобы изображение сохраняло пропорции
              }}
            />
          </View>
          <Text
            style={{
              flex: 1, // Занимает доступное пространство
              justifyContent: 'center', // Центрирует текст
              textAlign: 'left',
              fontSize: 12,
              fontWeight: '700',
              paddingTop: 4,
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {title}
          </Text>
          <Text
            style={{
              color: '#878B93',
              fontWeight: '700',
              fontSize: 12,
              paddingVertical: 4,
            }}>
            {value}
          </Text>
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
      <StatusBar barStyle={'dark-content'} backgroundColor="#fff" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.deliveryBox} onPress={() => setSelectAddressView(true)}>
            <Text style={{fontSize: 12, fontWeight: '600', color: '#62666E'}}>Куда доставить:</Text>
            <View style={styles.deliveryAddress_box}>
              <Text style={{fontSize: 14, fontWeight: '700', color: '#3F3F3F'}}>
                {selectedAddress ?? 'Выберите адрес'}
              </Text>
              <Ionicons name="chevron-down-outline" size={12} color="#000" />
            </View>
          </TouchableOpacity>
          <View style={styles.searchbar}>
            <Ionicons name="search" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Искать товары"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <FlatList
            key={searchResults.length > 0 ? 'search' : 'categories'}
            data={searchResults.length > 0 ? searchResults : categories}
            renderItem={({item}) =>
              searchResults.length > 0 ? (
                <ProductView
                  title={item.name}
                  price={item.prices.regular.toString()}
                  id={item.plu}
                  image={item.image_links.small[0]}
                  value={item.property_clarification}
                />
              ) : (
                <Categories title={item.name} subcategories={item.categories ?? []} />
              )
            }
            keyExtractor={(item) => item.id ?? item.plu.toString()}
            numColumns={searchResults.length > 0 ? 3 : 1}
          />
          {productCardView && (
            <ProductCard productId={productId} setProductCardView={setProductCardView} />
          )}
          {cart.length > 0 && <CartButton />}
          {selectAddressView && <SelectAddress setSelectAddressView={setSelectAddressView} />}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default Home
