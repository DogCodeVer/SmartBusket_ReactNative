import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useEffect, useState, useRef} from 'react'
import {Text, View, TouchableOpacity, FlatList, Image} from 'react-native'
import {RootStackParamList} from '../navigation/AppNavigation'
import {styles} from '../styles/Basket'
import {Ionicons} from '@expo/vector-icons'
import {getCart, getCartTotal, updateCartItem} from '../utils/cartStore'
import {SafeAreaView} from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Basket'>

const Basket: React.FC<Props> = ({navigation}) => {
  const [cart, setCart] = useState<
    {id: number; title: string; price: number; quantity: number; image: string; value: string}[]
  >([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  // Функция загрузки товаров из корзины
  const fetchCart = async () => {
    const cartItems = await getCart()
    const total = await getCartTotal()
    setCart(cartItems)
    setTotalPrice(total)
  }

  // Обновление количества товара
  const updateCartItemQuantity = async (id: number, change: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? {...item, quantity: Math.max(0, item.quantity + change)} : item,
      )
      .filter((item) => item.quantity > 0) // Удаляем товар, если его количество стало 0

    setCart(updatedCart) // Обновляем корзину
    setTotalPrice(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)) // Пересчитываем сумму

    await updateCartItem(id, change) // Сохраняем изменения в хранилище
  }

  // Загружаем корзину при открытии экрана
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchCart)
    return unsubscribe
  }, [navigation])

  return (
    <SafeAreaView style={{backgroundColor: '#ffffff'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Корзина</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
            <Ionicons name="close" size={18} color="#FF7269" />
          </TouchableOpacity>
        </View>
        <View style={styles.blockInfo}>
          <Text style={styles.blockInfoText}>Ваша корзина будет создана в этом магазине:</Text>
          <View style={styles.blockInfoShop}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Magnit_logo.png/800px-Magnit_logo.png',
              }}
              style={styles.shopImage}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.textPrice}>{totalPrice} ₽</Text>
              <Ionicons name="trash" size={20} color="#FF7269CC" />
            </View>
          </View>
        </View>

        <FlatList
          style={styles.listContainer}
          data={cart}
          renderItem={({item}) => (
            <View style={styles.cartItems}>
              <View
                style={{
                  backgroundColor: '#F7FAFF',
                  borderRadius: 12,
                  padding: 5,
                }}>
                <Image
                  source={{uri: item.image}}
                  style={{
                    width: 65,
                    height: 65,
                  }}
                />
              </View>
              <View>
                <Text>{item.title}</Text>
                <View style={styles.productInfo}>
                  <Text>{item.price} ₽</Text>
                  <View style={styles.dotDivider}></View>
                  <Text>{item.value}</Text>
                </View>
              </View>
              <View style={styles.quantityPicker}>
                <TouchableOpacity
                  style={styles.addRemoveButon}
                  onPress={() => updateCartItemQuantity(item.id, -1)}>
                  <Ionicons name="remove" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.addRemoveButon}
                  onPress={() => updateCartItemQuantity(item.id, 1)}>
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  )
}

export default Basket
