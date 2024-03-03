import { ActivityIndicator, Alert, FlatList, FlatListProps, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ChatMessageType, ChatRoomType } from '../../helper/types'
import useActionCable from '../../hooks/useActionCable';
import useChannel from '../../hooks/useChannel';

const CustomerToEmployeeChat = ({ navigation, route }: any) => {
    const { BaseURL, WSBaseURL } = useAuth()
    let flatListRef = useRef<FlatList>(null);
    const { actionCable } = useActionCable( WSBaseURL + "/cable")
    const { subscribe, unsubscribe, send } = useChannel(actionCable)

    const [messages, setMessages] = useState<ChatMessageType[]>([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const fetchMessagesByChatId = async (id: number) => {
        try {
            setLoading(true)
            const response = await fetch(`${BaseURL}/chat_rooms/${id}/messages`);
            const responseJson = await response.json();

            if (responseJson) {
                setMessages(responseJson)
            }
            else {
                Alert.alert("Something went wrong", "Error getting messages from chat room")
            }
        }
        catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.name, err.message)
            }
            else {
                console.error(err)
            }
        }
        finally {
            setLoading(false)
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            }, 100)
        }
    }

    const channelSubscribe = (channel_name: string, params: any = {}) => {
        subscribe({ channel: channel_name, ...params }, {
            received: (x) => {
                console.log(x, "RECEIVED DATA")
                const receivedData = x;
                if (receivedData.action === "delete") {
                    // Assuming receivedData.data is an object with an `id` property
                    const id = receivedData.data.id;
                    setMessages((currentData: any[]) => currentData.filter((item) => item.id !== id));
                }
                else if (receivedData.action === "create_message") {
                    const receivedMessageData = receivedData.data.message;
                    setMessages((currentData: any[]) => [...currentData, receivedMessageData]);
                    flatListRef.current?.scrollToEnd({ animated: true })
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
    }
    useEffect(() => {
        fetchMessagesByChatId(route.params.item.id)
        channelSubscribe("ChatroomChannel", { chat_room_id: route.params.item.id })
        return () => {
            unsubscribe()
        }
    }, [])

    const renderMessages = (item: ChatMessageType) => {
        return (
            <View style={{
                alignItems: item.sender_type === "employee" ?  "flex-start" : 'flex-end'
            }}>
                <View style={{
                    backgroundColor: '#ccc',
                    margin: 5,
                    padding: 5,
                    minWidth: 100,
                    borderRadius: 6
                }}>
                    <Text style={{
                        textAlign: item.sender_type === "employee" ? "left" : "right"
                    }}>{item.body}</Text>
                </View>
            </View>
        )
    }

    const sendMessageByChatId = async (item: ChatRoomType) => {
        try {
            setLoading(true)
            let formData = new FormData();
            formData.append("message[body]", message)
            formData.append("message[chat_room_id]", item.id)
            formData.append("message[employee_id]", item.employee_id)
            formData.append("message[customer_id]", item.customer_id)
            formData.append("message[sender_type]", "customer")
            const response = await fetch(`${BaseURL}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: formData
            })

            const responseJson = await response.json();

            if(responseJson) {
                console.log(responseJson)
            }
            else {
                Alert.alert("Something went wrong", JSON.stringify(responseJson))
            }
        }
        catch (err) {
            if (err instanceof Error) {
                Alert.alert(err.name, err.message)
            }
            else {
                console.error(err)
            }
        }
        finally {
            setLoading(false)
            setMessage("")
            Keyboard.dismiss()
        }
    }
    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
                <Text>Customer To Employee Chat</Text>
                <Text>Room name: {route.params.item.name} | Room id: {route.params.item.id}</Text>
                <Text>{`You are chatting with employee id ${route.params.item.employee_id}`}</Text>
            </View>
            <View style={{ flex: 0.8 }}>
                <FlatList ref={flatListRef} data={messages} renderItem={({ item }) => renderMessages(item)}
                keyExtractor={(item) => item.id.toString()} 
                ListEmptyComponent={loading ? <ActivityIndicator /> : <Text style={{ textAlign: 'center'}}>messages not found</Text>}
                 />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput placeholder='Enter message...' style={{ margin: 5 }} 
                value={message} onChangeText={(text) => setMessage(text)}/>
                <TouchableOpacity style={{
                    justifyContent: 'center', alignItems: 'center', padding: 10,
                    backgroundColor: "#32a6f3", margin: 5
                }} onPress={() => sendMessageByChatId(route.params.item)}>
                    <Text>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomerToEmployeeChat

const styles = StyleSheet.create({})