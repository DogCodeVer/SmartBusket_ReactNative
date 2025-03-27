import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAddresses = async (): Promise<string[]> => {
	try {
		const addresses = await AsyncStorage.getItem('addresses');
		return addresses ? JSON.parse(addresses) : [];
	} catch (error) {
		console.error('Ошибка при получении адресов:', error);
		return [];
	}
};

export const addAddress = async (address: string): Promise<void> => {
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

export const selectAddress = async (address: string): Promise<void> => {
	if (!address) return; // Если адрес пустой, ничего не делаем

	const addresses = await getAddresses(); // Загружаем все сохраненные адреса

	// Проверяем, существует ли такой адрес в списке
	if (!addresses.includes(address)) {
		console.log('Этот адрес не найден в списке');
		return; // Если адрес не найден, выходим из функции
	}

	// Если адрес найден, сохраняем его в качестве выбранного
	await AsyncStorage.setItem('selectedAddress', address);
};

export const deleteAddress = async (address: string): Promise<void> => {
	if (!address) return; // Если адрес пустой, ничего не делаем

	try {
		const addresses = await getAddresses(); // Загружаем все сохраненные адреса

		// Фильтруем список, убирая удаляемый адрес
		const updatedAddresses = addresses.filter(addr => addr !== address);

		// Сохраняем обновленный список в AsyncStorage
		await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));

		// Если удаляемый адрес был выбран, сбрасываем его
		const selectedAddress = await AsyncStorage.getItem('selectedAddress');
		if (selectedAddress === address) {
			await AsyncStorage.removeItem('selectedAddress');
		}

		console.log(`Адрес "${address}" удален`);
	} catch (error) {
		console.error('Ошибка при удалении адреса:', error);
	}
};

export const getSelectedAddress = async (): Promise<string | null> => {
	try {
		const address = await AsyncStorage.getItem('selectedAddress');
		return address ? address : null;
	} catch (error) {
		console.error('Ошибка при получении выбранного адреса:', error);
		return null;
	}
};
