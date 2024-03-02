import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface Props {
    navigation: any
    route: any
}
const Signup = (props: Props) => {
  return (
    <View>
      <Text>Signup</Text>
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