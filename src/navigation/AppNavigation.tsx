import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import PasswordRecovery from '../screens/PasswordRecovery';
import Home from '../screens/Home';
import Categories from '../screens/Categories';
import Basket from '../screens/Basket';
import AddAddress from '../screens/AddAddress';

export type RootStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
	PasswordRecovery: undefined;
	Home: undefined;
	Categories: { subcategoryId: string };
	Basket: undefined;
	CartButton: undefined;
	AddAddress: undefined;
	SelectAddress: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
	<NavigationContainer>
		<Stack.Navigator initialRouteName='SignIn'>
			<Stack.Screen
				name='SignIn'
				component={SignIn}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='SignUp'
				component={SignUp}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='PasswordRecovery'
				component={PasswordRecovery}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='Home'
				component={Home}
				options={{ headerShown: false, gestureEnabled: false }}
			/>
			<Stack.Screen
				name='Categories'
				component={Categories}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='Basket'
				component={Basket}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='AddAddress'
				component={AddAddress}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	</NavigationContainer>
);

export default AppNavigator;
