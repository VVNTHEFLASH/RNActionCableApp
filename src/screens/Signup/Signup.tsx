import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface Props {
  navigation: any
  route: any
}
const Signup = ({ navigation, route }: Props) => {
  return (
    <View>
      <Text>Signup</Text>
      <Text>User Type: {route.params.type}</Text>

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