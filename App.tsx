import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, FlatList, TextInput } from 'react-native'
import useActionCable from './src/hooks/useActionCable';
import useChannel from './src/hooks/useChannel';

export default function App() {
  const { actionCable } = useActionCable('ws://10.0.2.2:3000/cable')
  const { subscribe, unsubscribe, send } = useChannel(actionCable)
  const [data, setData] = useState<any>([])
  const [message, setMessage] = useState("")

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/messages");
      const responseJson = await response.json();

      setData(responseJson)

    }
    catch (err) {
      console.log(err)
      Alert.alert(JSON.stringify(err))
    }
    finally {
      console.log("Fetched")
    }
  }

  useEffect(() => {
    fetchMessages()
    subscribe({ channel: 'MessagesChannel' }, {
      received: (x) => {
        console.log(x, "RECEIVED DATA")
        const receivedData = x;
        if (receivedData.action === "delete") {
          // Assuming receivedData.data is an object with an `id` property
          const id = receivedData.data.id;
          setData((currentData: any[]) => currentData.filter((item) => item.id !== id));
        }
        else if (receivedData.action === "create") {
          const receivedMessageData = receivedData.data;
          setData((currentData: any[]) => [...currentData, receivedMessageData]);
        }
        else {
          console.log("swr", receivedData)
        }

      },
      initialized: function (): void {
        console.log("INIT")
      },
      connected: function (): void {
        console.log("connected")
      },
      disconnected: function (): void {
        console.log("disconnected")
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const renderItem = (item: {
    id: number;
    body: string;
  }) => {
    return (
      <View>
        <Text>{item.id}: {item.body}</Text>
        <Button title='Delete' color={"red"} onPress={() => deleteMessage(item.id)} />
      </View>
    )
  }

  const deleteMessage = async (id: number) => {
    try {
      await fetch(`http://10.0.2.2:3000/messages/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        }
      })
    } catch (error) {
      Alert.alert("Error deleting", JSON.stringify(error))
    }
  }

  const sendMessage = async () => {
    try {
      if (!message.trim()) {
        return
      }
      const body = message;
      await fetch("http://10.0.2.2:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ body })
      })
    }
    catch (error) {
      Alert.alert("Error sending message", JSON.stringify(error))
    }
    finally {
      setMessage("")
    }
  }
  return (
    <View>
      <View>
        <TextInput placeholder='Enter message...' value={message}
          onChangeText={(text) => setMessage(text)} />
        <Button title='Send' onPress={sendMessage} />
      </View>
      <View>
        <FlatList data={data}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id.toString()}
          extraData={data} />
      </View>
    </View>
  );
}