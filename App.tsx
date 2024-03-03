import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createSwitchNavigator } from '@react-navigation/compat';
import Home from './src/screens/Home/Home';
import Signup from './src/screens/Signup/Signup';
import Splash from './src/screens/Splash/Splash';
import Login from './src/screens/Login/Login';
import Landing from './src/screens/Landing/Landing';
import { AuthProvider } from './src/context/AuthContext';
import { AsyncStorageHelper, StorageKeys } from "./src/helper/utilities";
import CustomerHome from './src/screens/Home/CustomerHome';
import EmployeeHome from './src/screens/Home/EmployeeHome';
import EmployeeToCustomerChat from './src/screens/Chat/EmployeeToCustomerChat';
import CustomerToEmployeeChat from './src/screens/Chat/CustomerToEmployeeChat';

const Stack = createNativeStackNavigator();

export default function App() {

  const EmployeeRoute = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={EmployeeHome} />
      <Stack.Screen name="EmployeeToCustomerChat" component={EmployeeToCustomerChat} />
    </Stack.Navigator>
  );

  const CustomerRoute = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={CustomerHome} />
      <Stack.Screen name="CustomerToEmployeeChat" component={CustomerToEmployeeChat} />
    </Stack.Navigator>
  );

  const DefaultRoute = () => (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );

  const SwitchRoutes = createSwitchNavigator({
    DefaultRoute: DefaultRoute,
    CustomerRoute,
    EmployeeRoute
  });

  return (
    <AuthProvider>
      <NavigationContainer>
        <SwitchRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}
