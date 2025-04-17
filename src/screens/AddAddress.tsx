import React, {useEffect, useState} from 'react'
import {
  FlatList,
  SafeAreaView,
  SafeAreaViewBase,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../navigation/AppNavigation'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Ionicons} from '@expo/vector-icons'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {styles} from '../styles/AddAddress'
import * as Location from 'expo-location'
import {addAddress, getAddresses} from '../utils/addressSaved'
import Constants from 'expo-constants'

type Props = NativeStackScreenProps<RootStackParamList, 'AddAddress'>

const AddAddress: React.FC<Props> = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [location, setLocation] = useState<{lat: number; lon: number} | null>(null)

  const fetchAddress = async () => {
    const url = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Token f496e4b5f37cec8eb4c3dfa832cdfcf97088eaa6',
        },
        body: JSON.stringify({query: searchQuery}),
      })
      const data = await response.json()
      setSearchResults(data.suggestions)
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  useEffect(() => {
    if (!searchQuery) return
    fetchAddress()
  }, [searchQuery])

  async function requestPermission() {
    const {status} = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Разрешение на геолокацию отклонено')
      return false
    }
    return true
  }

  async function getGeolocation() {
    const hasPermission = await requestPermission()
    if (!hasPermission) return
    const location = await Location.getCurrentPositionAsync({})
    setLocation({
      lat: location.coords.latitude,
      lon: location.coords.longitude,
    })
    // console.log(location);
  }

  useEffect(() => {
    if (!location) return
    const fetchAddressByGeo = async () => {
      const url = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address'
      // console.log(location);
      try {
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Тoken f496e4b5f37cec8eb4c3dfa832cdfcf97088eaa6',
          },
          body: JSON.stringify({lat: location.lat, lon: location.lon}),
        })
        const data = await response.json()
        setSearchQuery(data.suggestions[0]?.value)
      } catch (error) {
        console.error('Ошибка:', error)
      }
    }
    fetchAddressByGeo()
  }, [location])

  return (
    <GestureHandlerRootView>
      <StatusBar barStyle={'dark-content'} backgroundColor="#fff" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.appbar}>
            <Ionicons
              name="arrow-back"
              size={20}
              color="black"
              onPress={() => navigation.goBack()}
            />
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: '700', fontSize: 18}}>Адрес доставки</Text>
            </View>
          </View>

          <View style={{flex: 1}}>
            <View style={styles.searchSection}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#878B93"
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.input, isFocused && styles.inputFocused]}
                onFocus={() => {
                  setIsFocused(true), fetchAddress()
                }}
                onBlur={() => {
                  setIsFocused(false), setSearchResults([])
                }}
                placeholder="Введите адрес"
                placeholderTextColor="#999"
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
            </View>

            {isFocused && (
              <View style={searchQuery.length > 0 && styles.searchResults}>
                <FlatList
                  data={searchResults}
                  renderItem={({item}) => (
                    <TouchableOpacity onPress={() => setSearchQuery(item.value)}>
                      <Text>{item.value}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.value}
                />
              </View>
            )}

            <TouchableOpacity style={styles.detectLocation} onPress={() => getGeolocation()}>
              <Ionicons name="navigate" size={20} color="#3FBD00" />
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#3F3F3F',
                  paddingLeft: 12,
                }}>
                Определить автоматически
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              addAddress(searchQuery), navigation.navigate('Home')
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Сохранить адрес</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default AddAddress
