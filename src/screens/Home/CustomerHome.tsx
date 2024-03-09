import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChatRoomType, ChatRoomsType } from '../../helper/types'
import { useAuth } from '../../context/AuthContext'
import AsyncStorageHelper, { StorageKeys } from '../../helper/utilities';
import { DecodeResponse, decode } from "react-native-pure-jwt";
import useActionCable from '../../hooks/useActionCable';
import useChannel from '../../hooks/useChannel';

const CustomerHome = ({ navigation, route }: any) => {
    const { BaseURL, signOut, WSBaseURL } = useAuth()
    const [data, setData] = useState<ChatRoomsType>([])
    const [loading, setLoading] = useState(false)

    const { actionCable } = useActionCable(WSBaseURL + "/cable")
    const { subscribe, unsubscribe, send } = useChannel(actionCable)

    const channelSubscribe = (channel_name: string, params: any = {}) => {
        subscribe({ channel: channel_name, ...params }, {
            received: (x) => {
                const receivedData = x;
                if (receivedData.user_type === "employee") {
                    setData((currentData) => currentData.map((item) => {
                        if (item.employee_id === receivedData.user_id) {
                            return { ...item, isOnline: receivedData.online };
                        } else {
                            return item;
                        }
                    }));
                    console.log(receivedData, "RECEIVED DATA OF EMPLOYEE")

                }
                else {
                    console.log("Customer Home")
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

    const renderChatRoomListItems = (item: ChatRoomType) => {

        return (
            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate("CustomerToEmployeeChat", { item })
            }}>
                <Text style={styles.text}>{item.id} {item.name} Employee</Text>
                {/* <Text style={[styles.text]}>{item.isOnline ? "Online" : "Offline"}</Text> */}
            </TouchableOpacity>
        )
    }

    const fetchChatRoomsByUserIdAndType = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorageHelper.getValue(StorageKeys.customerToken);
            const decodedToken: DecodeResponse | any = await decode(token, "HS256", { skipValidation: true })
            console.log(decodedToken)
            const customer_id = decodedToken.payload.customer_id;
            const response = await fetch(`${BaseURL}/employees/${customer_id}/chat_rooms`);
            const responseJson = await response.json();

            if (responseJson) {
                const responseData: ChatRoomsType = responseJson
                setData(responseData)
                // responseData.forEach((item) => {
                //     channelSubscribe("PresenceChannel", {
                //         user_type: "employee",
                //         user_id: item.employee_id,
                //     })
                //     channelSubscribe("PresenceChannel", {
                //         user_type: "customer",
                //         user_id: item.customer_id,
                //     })
                // })
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
        fetchChatRoomsByUserIdAndType()
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={{
                flex: 0.1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <View>
                    <Text style={styles.text}>Who logged in</Text>
                    <Text style={styles.text}>Customer</Text>
                </View>
                <TouchableOpacity style={{
                    backgroundColor: "#f06a1d",
                    width: 150,
                    padding: 5,
                    borderRadius: 6
                }} onPress={() => signOut({ navigation })}>
                    <Text style={styles.text}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 0.9,
            }}>
                <Text style={[styles.text, {}]}>Chat Rooms</Text>
                <FlatList data={data}
                    extraData={data}
                    renderItem={({ item }) => renderChatRoomListItems(item)}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    ListEmptyComponent={loading ? <ActivityIndicator /> : <Text>Chat room not found</Text>} />
            </View>
        </View>
    )
}

export default CustomerHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'space-between',
    },
    text: {
        color: "#fff",
        textAlign: 'center'
    },
    button: {
        padding: 15,
        backgroundColor: "#581306",
        elevation: 4
    }

})