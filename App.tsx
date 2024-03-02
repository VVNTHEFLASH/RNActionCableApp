import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native'
import useActionCable from './src/hooks/useActionCable';
import useChannel from './src/hooks/useChannel';

export default function App() {
  const { actionCable } = useActionCable('ws://10.0.2.2:3000/cable')
  const { subscribe, unsubscribe, send } = useChannel(actionCable)
  const [data, setData] = useState([])

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/messages");
      const responseJson = await response.json();

      console.log(responseJson, "Response Json")
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
      received: (x) => setData(x),
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

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
      <Button title="Click!" onPress={() => send('click', { time: Date.now() })} />
    </View>
  );
}