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
import { styles } from '../styles/FilterCategory';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type SelectAddressProps = {
	setSelectFilterView: (value: boolean) => void;
};

const SelectAddress: React.FC<SelectAddressProps> = ({
	setSelectFilterView,
}) => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const [isOpen, setIsOpen] = useState(true);
	const navigation =
		useNavigation<NativeStackScreenProps<RootStackParamList>>();

	const handleSheetChanges = useCallback((index: number) => {
		if (index === -1) {
			hideOverlay();
		}
	}, []);

	const showOverlay = () => {
		setSelectFilterView(true);
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
		}).start(() => setSelectFilterView(false));
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
						<Text>Сортировать</Text>
						<View>
							<View>
								<Text>По цене</Text>
								<Text>Сначало дешевые продукты</Text>
							</View>
						</View>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</GestureHandlerRootView>
	);
};

export default SelectAddress;
