import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

interface BottomSheetComponentProps {
	sheetRef: React.RefObject<BottomSheet>;
}

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
	sheetRef,
}) => {
	const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('BottomSheet index:', index);
	}, []);

	return (
		<BottomSheet
			ref={sheetRef}
			index={-1}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
		>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Это Bottom Sheet!</Text>
			</View>
		</BottomSheet>
	);
};

export default BottomSheetComponent;
