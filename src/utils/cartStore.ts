import AsyncStorage from '@react-native-async-storage/async-storage'
import {emitCartUpdate} from '../utils/cartEventEmitter'

export const getCart = async () => {
  try {
    const cart = await AsyncStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Ошибка при получении корзины:', error)
    return []
  }
}

export const addToCart = async (product: {
  id: any
  title?: string
  price?: string
  image?: string
  value?: string
}) => {
  try {
    const cart = await getCart()
    const existingItem = cart.find((item: {id: any}) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({...product, quantity: 1})
    }

    await AsyncStorage.setItem('cart', JSON.stringify(cart))
    emitCartUpdate() // 🔥 Уведомляем слушателей
  } catch (error) {
    console.error('Ошибка при добавлении в корзину:', error)
  }
}

export const removeFromCart = async (productId: number) => {
  try {
    let cart = await getCart()
    const existingItem = cart.find((item: {id: any}) => item.id === productId)

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1
      } else {
        cart = cart.filter((item: {id: any}) => item.id !== productId)
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart))
      emitCartUpdate() // 🔥 Уведомляем слушателей
    }
  } catch (error) {
    console.error('Ошибка при удалении из корзины:', error)
  }
}

export const getCartTotal = async () => {
  try {
    const cart = await getCart()
    return cart.reduce(
      (total: number, item: {price: number; quantity: number}) =>
        total + item.price * item.quantity,
      0,
    )
  } catch (error) {
    console.error('Ошибка при расчете суммы корзины:', error)
    return 0
  }
}

// 🔹 Функция обновления количества товара в корзине
export const updateCartItem = async (productId: number, change: number) => {
  try {
    let cart = await getCart()
    const existingItem = cart.find((item: {id: any}) => item.id === productId)

    if (existingItem) {
      existingItem.quantity = Math.max(0, existingItem.quantity + change)
      if (existingItem.quantity === 0) {
        cart = cart.filter((item: {id: any}) => item.id !== productId)
      }
    }

    await AsyncStorage.setItem('cart', JSON.stringify(cart))
    emitCartUpdate() // 🔥 Уведомляем слушателей
  } catch (error) {
    console.error('Ошибка при обновлении количества товара:', error)
  }
}
