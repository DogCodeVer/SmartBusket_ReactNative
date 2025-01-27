import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import PasswordRecovery from '../screens/PasswordRecovery';
import Home from '../screens/Home';

export type RootStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
	PasswordRecovery: undefined;
	Home: undefined;
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
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	</NavigationContainer>
);

export default AppNavigator;
