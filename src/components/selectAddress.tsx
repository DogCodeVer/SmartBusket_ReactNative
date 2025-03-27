import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	Animated,
	StatusBar,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { styles } from '../styles/SelectAddress';
import { Ionicons } from '@expo/vector-icons';
import {
	deleteAddress,
	getAddresses,
	getSelectedAddress,
	selectAddress,
} from '../utils/addressSaved';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type SelectAddressProps = {
	setSelectAddressView: (value: boolean) => void;
};

const SelectAddress: React.FC<SelectAddressProps> = ({
	setSelectAddressView,
}) => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [addresses, setAddresses] = useState<string[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const [isOpen, setIsOpen] = useState(true);
	const navigation =
		useNavigation<NativeStackScreenProps<RootStackParamList>>();

	const loadSelectedAddress = async () => {
		try {
			const address = await getSelectedAddress();
			if (address) {
				setSelectedAddress(address);
			}
		} catch (error) {
			console.error('Ошибка при загрузке выбранного адреса:', error);
		}
	};

	const saveSelectedAddress = async (address: string) => {
		try {
			await selectAddress(address);
			setSelectedAddress(address);
		} catch (error) {
			console.error('Ошибка при выборе адреса:', error);
		}
	};

	// Загрузка адресов и выбранного адреса
	useEffect(() => {
		const fetchAddressesData = async () => {
			try {
				const savedAddresses = await getAddresses();
				setAddresses(savedAddresses);
				await loadSelectedAddress();
			} catch (error) {
				console.error('Ошибка загрузки адресов:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAddressesData();
	}, []);

	const handleSelectAddress = (address: string) => {
		saveSelectedAddress(address);
	};

	const handleDeleteAddress = async (address: string) => {
		try {
			await deleteAddress(address);
			const updatedAddresses = await getAddresses();
			setAddresses(updatedAddresses);
			const selected = await getSelectedAddress();
			setSelectedAddress(selected);
		} catch (error) {
			console.error('Ошибка при удалении адреса:', error);
		}
	};

	const handleSheetChanges = useCallback((index: number) => {
		if (index === -1) {
			hideOverlay();
		}
	}, []);

	const showOverlay = () => {
		setSelectAddressView(true);
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const hideOverlay = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(() => setSelectAddressView(false));
	};

	useEffect(() => {
		showOverlay();
		StatusBar.setBarStyle('light-content', true);
		StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.5)', true);
	}, []);

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
				snapPoints={['30%', '50%', '90%']}
				onChange={handleSheetChanges}
				enablePanDownToClose={true} // Закрытие свайпом вниз
				style={styles.viewStyle}
			>
				<BottomSheetView>
					<View style={{ paddingHorizontal: 16 }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: '700',
								alignSelf: 'center',
								color: '#3F3F3F',
								paddingBottom: 16,
							}}
						>
							Адрес доставки
						</Text>
						{loading ? (
							<ActivityIndicator size='large' color='#0000ff' />
						) : addresses && addresses.length > 0 ? (
							addresses.map((addr, index) => (
								<View key={index} style={styles.addressBox}>
									<TouchableOpacity
										style={{ flexDirection: 'row', flex: 1 }}
										onPress={() => handleSelectAddress(addr)}
									>
										<Ionicons
											name={
												selectedAddress === addr
													? 'checkmark-circle'
													: 'ellipse-outline'
											}
											size={24}
											color='#3FBD00'
										/>
										<Text
											style={{
												fontSize: 14,
												fontWeight: '600',
												color: '#62666E',
												paddingLeft: 8,
												flexWrap: 'wrap',
												flexShrink: 1,
											}}
										>
											{addr}
										</Text>
									</TouchableOpacity>

									<Ionicons
										name='trash'
										size={24}
										color='#3F3F3F'
										onPress={() => handleDeleteAddress(addr)}
									/>
								</View>
							))
						) : (
							<TouchableOpacity
								onPress={() => navigation.navigate('AddAddress')}
							>
								<Ionicons name='add' size={24} color='#3FBD00' />
								<Text
									style={{
										fontSize: 14,
										fontWeight: '600',
										color: '#62666E',
										flex: 1,
										paddingLeft: 8,
									}}
								>
									Новый адрес
								</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity
							style={styles.addAddressBox}
							onPress={() => navigation.navigate('AddAddress')}
						>
							<Ionicons name='add' size={24} color='#3FBD00' />
							<Text
								style={{
									fontSize: 14,
									fontWeight: '600',
									color: '#62666E',
									flex: 1,
									paddingLeft: 8,
								}}
							>
								Новый адрес
							</Text>
						</TouchableOpacity>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</GestureHandlerRootView>
	);
};

export default SelectAddress;
