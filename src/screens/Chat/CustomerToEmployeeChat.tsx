import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const CustomerToEmployeeChat = ({ navigation, route}: any) => {
    const { BaseURL} = useAuth()
    const [messages, setMessages] = useState([])
    const fetchMessagesByChatId = async (id:number) => {
        const response = await fetch(`${BaseURL}/chat_rooms/${id}/messages`);
        const responseJson = await response.json();

        if(responseJson) {
            setMessages(responseJson)
        }
        else {
            Alert.alert("Something went wrong", "Error getting messages from chat room")
        }
    }
    useEffect(() => {
        fetchMessagesByChatId(route.params.item.id)
    }, [])
  return (
    <View>
      <Text>CustomerToEmployeeChat</Text>
      <Text>{JSON.stringify(route.params.item)}</Text>
      <Text>{JSON.stringify(messages)}</Text>
    </View>
  )
}

export default CustomerToEmployeeChat

const styles = StyleSheet.create({})