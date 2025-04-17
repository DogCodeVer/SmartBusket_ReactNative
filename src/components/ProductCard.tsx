import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet'
import {Ionicons} from '@expo/vector-icons'
import {styles} from '../styles/ProductCard'
import {addToCart, getCart, removeFromCart} from '../utils/cartStore'

type ProductCardProps = {
  productId: string | undefined
  setProductCardView: (value: boolean) => void
}

const ProductCard: React.FC<ProductCardProps> = ({productId, setProductCardView}) => {
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
    promo: null | string
    prices: {
      value: string
      placement_type: string
    }[]
    labels: {
      label: string
      bg_color: string
      text_color: string
    }[]
    property_clarification: string
    has_age_restriction: boolean
    stock_limit: string
    description: string
    description_md: string
    description_html: null | string
    nutrients: {
      value: string
      text: string
    }[]
    attributes: {
      name: string
      value: string
      uom: string | null
    }[]
    ingredients: string
    ingredients_html: null | string
    is_available: boolean
    is_various_manufacturers: boolean
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [product, setProduct] = useState<Product>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [cart, setCart] = useState<{id: number; quantity: number}[]>([])
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [isOpen, setIsOpen] = useState(true)

  // Загрузка данных продукта
  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `http://212.193.26.110:8000/parser/get_product_info/${productId}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()

      if (data) {
        setProduct(data)
      } else {
        setProduct(undefined)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct(productId)
  }, [])

  useEffect(() => {
    const loadCart = async () => {
      const cartData = await getCart()
      setCart(cartData)
    }
    loadCart()
  }, [])

  const quantity = cart.find((item) => item.id === Number(productId))?.quantity || 0

  const handleAddToCart = async ({
    id,
    title,
    price,
    image,
    value,
  }: {
    id: number
    title: string
    price: string
    image: string
    value: string
  }) => {
    await addToCart({id, title, price, image, value})
    const updatedCart = await getCart() // Загружаем обновленные данные корзины
    setCart(updatedCart)
  }

  const handleRemoveFromCart = async () => {
    if (quantity > 0 && product?.plu) {
      await removeFromCart(product.plu)
      const updatedCart = await getCart()
      setCart(updatedCart)
    }
  }

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) hideOverlay()
  }, [])

  const showOverlay = useCallback(() => {
    setProductCardView(true)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim, setProductCardView])

  const hideOverlay = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setProductCardView(false))
  }, [fadeAnim, setProductCardView])

  useEffect(() => {
    showOverlay()
    StatusBar.setBarStyle('light-content', true)
    StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.5)', true)
  }, [showOverlay])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {isOpen && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Затемнение
            opacity: fadeAnim,
          }}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={0} // Открыто по умолчанию
        snapPoints={['80%']}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        style={styles.viewStyle}>
        <BottomSheetView>
          <View style={styles.imageContainerBS}>
            <Image source={{uri: product?.image_links.normal[0]}} style={styles.image} />
            <TouchableOpacity
              onPress={() => setProductCardView(false)}
              style={{
                position: 'absolute',
                right: 15,
                top: 15,
                backgroundColor: '#62666E',
                borderRadius: 50,
                padding: 3,
              }}>
              <Ionicons name="close" size={20} color="#F7FAFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.textTilte}>{product?.name}</Text>
            <Text style={styles.textTilteGrey}>{product?.property_clarification}</Text>
            <View style={styles.divideLine} />
            <View>
              <Text style={styles.textTitleSmall}>На 100 г</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.textBGU}>{product?.nutrients[3].value}</Text>
                  <Text style={styles.textTitleSmall}>ккал</Text>
                </View>
                <View>
                  <Text style={styles.textBGU}>{product?.nutrients[0].value}</Text>
                  <Text style={styles.textTitleSmall}>белки</Text>
                </View>
                <View>
                  <Text style={styles.textBGU}>{product?.nutrients[1].value}</Text>
                  <Text style={styles.textTitleSmall}>жиры</Text>
                </View>
                <View>
                  <Text style={styles.textBGU}>{product?.nutrients[2].value}</Text>
                  <Text style={styles.textTitleSmall}>углеводы</Text>
                </View>
              </View>
              <View style={styles.divideLine} />
            </View>
            <View style={{marginBottom: 10}}>
              <Text style={styles.textTitleSmall}>Состав</Text>
              <Text style={styles.textDefault}>{product?.ingredients}</Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.textTitleSmall}>Срок и условия хранения</Text>
              <Text style={styles.textDefault}>
                {product?.attributes[1].value}, {product?.attributes[2].value}
              </Text>
            </View>
            <View style={styles.addCartBlock}>
              <Text style={styles.priceText}>{Math.round(product?.prices[0].value)} ₽</Text>
              {quantity === 0 ? (
                <TouchableOpacity
                  style={styles.addCartButton}
                  onPress={() =>
                    handleAddToCart({
                      id: product?.plu!,
                      title: product?.name ?? '',
                      price: product?.prices[0].value ?? '',
                      image: product?.image_links.normal[0] ?? '',
                      value: product?.property_clarification ?? '',
                    })
                  }>
                  <Text style={styles.buttonText}>Добавить в корзину</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.quantityPicker}>
                  <TouchableOpacity onPress={handleRemoveFromCart} style={styles.quantityButton}>
                    <Ionicons name="remove" size={24} color="#3FBD00" />
                  </TouchableOpacity>
                  <Text style={styles.textQuantity}>{quantity}</Text>
                  <TouchableOpacity
                    // onPress={handleAddToCart}
                    style={styles.quantityButton}>
                    <Ionicons name="add" size={24} color="#3FBD00" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  )
}

export default ProductCard
