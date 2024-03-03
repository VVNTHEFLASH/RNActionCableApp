import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home/Home';
import Signup from './src/screens/Signup/Signup';
import Splash from './src/screens/Splash/Splash';
import Login from './src/screens/Login/Login';

import { StorageKeys, AsyncStorageHelper } from "./src/helper/utilities";
import Landing from './src/screens/Landing/Landing';
import { AuthProvider } from './src/context/AuthContext';
const Stack = createNativeStackNavigator();
export default function App() {

  const [type, setType] = useState<"EMPLOYEE" | "CUSTOMER" | null>(null)
  const getSessionDetails = async () => {
    const userType = await AsyncStorageHelper.getValue(StorageKeys.loggedInUserType)
    if (userType) {

      if (userType === 'EMPLOYEE') {
        setType("EMPLOYEE")
      }
      else if (userType === "CUSTOMER") {
        setType("CUSTOMER")
      }
      else {
        setType(null)
      }
    }
  }
  useEffect(() => {
    getSessionDetails()
    return () => {
      // return unsubscribe functions
    }
  }, [])

  const EmployeeRoute = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    )
  }

  const CustomerRoute = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    )
  }

  const DefaultRoute = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash} options={{
          
        }} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>

    )
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        {type === "CUSTOMER" ? CustomerRoute() : type === "EMPLOYEE" ? EmployeeRoute() : DefaultRoute()}
      </NavigationContainer>
    </AuthProvider>
  )
}