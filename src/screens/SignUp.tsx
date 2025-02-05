import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../navigation/AppNavigation'
import supabase from '../config/supabaseConfig'
import {styles} from '../styles/SignUp'

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>

const SignUp: React.FC<Props> = ({navigation}) => {
  const [email, onChangeEmail] = useState('')
  const [password, onChangePassword] = useState('')
  const [passwordConfim, onChangePasswordConfim] = useState('')
  const [isFocusedPassword, setIsFocusedPassword] = useState(false)
  const [isFocusedEmail, setIsFocusedEmail] = useState(false)
  const [isFocusedPasswordConfim, setIsFocusedPasswordConfim] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Функция для регистрации
  const handleSignUp = async () => {
    if (password !== passwordConfim) {
      setError('Пароли не совпадают')
      return
    }

    setLoading(true)
    setError(null) // Сброс ошибки перед запросом

    try {
      const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        navigation.navigate('SignIn')
      }
    } catch (err) {
      console.error(err)
      setError('Произошла ошибка при регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        style={[styles.input, isFocusedEmail && styles.inputFocused]}
        onFocus={() => setIsFocusedEmail(true)}
        onBlur={() => setIsFocusedEmail(false)}
        placeholder="Email"
        placeholderTextColor="#999"
        onChangeText={onChangeEmail}
        value={email}
      />
      <TextInput
        style={[styles.input, isFocusedPassword && styles.inputFocused]}
        onFocus={() => setIsFocusedPassword(true)}
        onBlur={() => setIsFocusedPassword(false)}
        placeholder="Пароль"
        placeholderTextColor="#999"
        secureTextEntry={!isPasswordVisible}
        onChangeText={onChangePassword}
        value={password}
      />

      <TextInput
        style={[styles.input, isFocusedPasswordConfim && styles.inputFocused]}
        onFocus={() => setIsFocusedPasswordConfim(true)}
        onBlur={() => setIsFocusedPasswordConfim(false)}
        placeholder="Подтвердите пароль"
        placeholderTextColor="#999"
        secureTextEntry={!isPasswordVisible}
        onChangeText={onChangePasswordConfim}
        value={passwordConfim}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText} onPress={() => navigation.navigate('SignIn')}>
            У вас уже есть аккаунт?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Загрузка...' : 'Зарегистрироваться'}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SignUp
