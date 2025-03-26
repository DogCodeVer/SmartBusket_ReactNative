// addressStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAddresses = async () => {
	try {
		const addresses = await AsyncStorage.getItem('addresses');
		return addresses ? JSON.parse(addresses) : [];
	} catch (error) {
		console.error('Ошибка при получении адресов:', error);
		return [];
	}
};

export const addAddress = async (address: string) => {
	if (!address) return; // Если адрес пустой, ничего не делаем

	const addresses = await getAddresses(); // Загружаем все сохраненные адреса

	// Проверяем, существует ли уже такой адрес в списке
	if (addresses.includes(address)) {
		console.log('Этот адрес уже существует в списке');
		return; // Если адрес уже есть, выходим из функции
	}

	// Если адрес не найден, добавляем его
	const updatedAddresses = [...addresses, address];

	// Сохраняем обновленный список адресов в AsyncStorage
	await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
};
