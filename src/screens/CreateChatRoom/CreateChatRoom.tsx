import { Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { UserDataType } from '../../helper/types'
import { UserType, useAuth } from '../../context/AuthContext'

const CreateChatRoom = ({ navigation, route }: any) => {
  const { BaseURL } = useAuth()
  const [data, setData] = useState<UserDataType[]>([])
  const [loading, setLoading] = useState(false)

  const renderItem = (item: UserDataType) => {
    return (
      <View>
        <Text style={styles.text}>{item.email}</Text>
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.text}>{item.id}</Text>
      </View>
    )
  }

  const fetchUserListByType = async (type: UserType) => {
    try {
      setLoading(true)
      const url = BaseURL + `/${type.toLowerCase()}`
      const response = await fetch(url);
      const responseJson = await response.json();

      if (responseJson && responseJson.data) {
        setData(responseJson.data)
      }
      else {
        Alert.alert("Something went wrong", JSON.stringify(responseJson))
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.name, error.message)
      }
    }
    finally {
      setLoading(false)

    }

  }

  useEffect(() => {

  })
  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        flexDirection: 'row',
        margin: 10,
      }}>
        <Button title='Back' onPress={() => {
          navigation.goBack()
        }} />
      </View>
      <Text style={styles.text}>Create Chat Room</Text>
      <Text style={styles.text}>{JSON.stringify(route.params.payload)}</Text>
      <FlatList data={data} renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id.toString()} />
    </SafeAreaView>
  )
}

export default CreateChatRoom

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  text: {
    color: "#fff",
    textAlign: 'center'
  }
})