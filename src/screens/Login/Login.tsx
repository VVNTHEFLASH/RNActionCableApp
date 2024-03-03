import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Login = ({ navigation, route}: any) => {
  return (
    <View>
      <Text>Login</Text>
      <Text>User Type: {route.params.type}</Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({})