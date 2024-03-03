import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const Splash = ({ navigation }: any) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("Landing")
        }, 3000)
    }, [])
  return (
    <View>
      <Text>Splash</Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({})