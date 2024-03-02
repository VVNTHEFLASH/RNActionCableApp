import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home/Home';
import Signup from './src/screens/Signup/Signup';

const Stack = createNativeStackNavigator();
export default function App() {

  const [isLogged, setIsLogged] = useState(true)

  useEffect(() => {

    return () => {
      // return unsubscribe functions
    }
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}