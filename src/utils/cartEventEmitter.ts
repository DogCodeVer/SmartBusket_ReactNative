import { DeviceEventEmitter } from 'react-native';

export const CART_UPDATED_EVENT = 'cartUpdated';

export const emitCartUpdate = () => {
	DeviceEventEmitter.emit(CART_UPDATED_EVENT);
};

export const subscribeToCartUpdates = (callback: () => void) => {
	const subscription = DeviceEventEmitter.addListener(
		CART_UPDATED_EVENT,
		callback
	);
	return () => subscription.remove();
};
