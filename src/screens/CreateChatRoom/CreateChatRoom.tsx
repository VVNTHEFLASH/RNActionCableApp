import {
  Alert, Button, FlatList,
  SafeAreaView, StyleSheet, Text, 
  TouchableOpacity, 
  View, 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UserDataType } from '../../helper/types'
import { UserType, useAuth } from '../../context/AuthContext'

const CreateChatRoom = ({ navigation, route }: any) => {
  const { BaseURL } = useAuth()
  const [data, setData] = useState<UserDataType[]>([])
  const [loading, setLoading] = useState(false)

  const renderItem = (item: UserDataType) => {
    return (
      <TouchableOpacity onPress={() => createNewChatRoom(item)}>
          <Text style={styles.text}>{item.email}</Text>
          <Text style={styles.text}>{item.name}</Text>
          <Text style={styles.text}>{item.id}</Text>
      </TouchableOpacity>
    )
  }
  const createNewChatRoom = async (item: UserDataType) => {
    try {
      setLoading(true);
      let payload = route.params.payload
      let isEmployee = payload.type === "employee";

      let formData = new FormData()
      formData.append("chat_room[name]", item.name)
      if(!isEmployee) {
        formData.append("chat_room[customer_id]", payload.customer_id.toString())
        formData.append("chat_room[employee_id]", item.id.toString())
      }
      else {
        formData.append("chat_room[employee_id]", payload.employee_id.toString())
        formData.append("chat_room[customer_id]", item.id.toString())
      }
      const url = BaseURL + `/chat_rooms`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: formData
      });
      const responseJson = await response.json();

      if (responseJson && responseJson.data) {
        console.log(responseJson.data)
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
  const fetchUserListByType = async () => {
    try {
      setLoading(true)
      let payload = route.params.payload
      let isEmployee = payload.type === "employee";
      const $type = !isEmployee ? "employees" : "customers"
      const url = BaseURL + `/${$type}`
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
    fetchUserListByType()
  }, [])
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