import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

interface Props {
  navigation: any
  route: any
}
const Signup = ({ navigation, route }: Props) => {
  return (
    <View>
      <Text style={{ textAlign: 'center', fontWeight: "800", fontSize: 20 }}>Signup</Text>
      <Text>User Type: {route.params.type}</Text>
      <View>
      <View>
          <Text>Name</Text>
          <TextInput placeholder='Enter name' />
        </View>
        <View>
          <Text>Email</Text>
          <TextInput placeholder='Enter email' />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput placeholder='Enter password' />
        </View>
        <View>
          <Button title='Signup' />
        </View>
      </View>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  }
})