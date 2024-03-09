import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User, useAuth } from '../../context/AuthContext'

interface Props {
  navigation: any
  route: any
}
const Signup = ({ navigation, route }: Props) => {

  const [userData, setUserData] = useState<User>({
    name: "",
    email: "",
    password: "",
    type: "USER"
  })

  useEffect(() => {
    setUserData((userData) => ({ ...userData, type: route.params.type }))
  }, [])

  const { signUpByType } = useAuth();

  return (
    <View>
      <Text style={{ textAlign: 'center', fontWeight: "800", fontSize: 20 }}>Signup</Text>
      <Text>User Type: {route.params.type}</Text>
      <View>
        <View>
          <Text>Name</Text>
          <TextInput placeholder='Enter name'
            value={userData.name}
            onChangeText={(text) => {
              setUserData((userData) => ({ ...userData, name: text }))
            }} />
        </View>
        <View>
          <Text>Email</Text>
          <TextInput placeholder='Enter email'
            value={userData.email}
            onChangeText={(text) => {
              setUserData((userData) => ({ ...userData, email: text }))
            }} />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput placeholder='Enter password'
            value={userData.password}
            onChangeText={(text) => {
              setUserData((userData) => ({ ...userData, password: text }))
            }} />
        </View>
        <View>
          <Button title='Signup' onPress={() => {
            console.log(userData)
            signUpByType(userData, { navigation, route })
          }} />
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