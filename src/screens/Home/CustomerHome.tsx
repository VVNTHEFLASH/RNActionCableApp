import { ActivityIndicator, Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
                console.log("connected", channel_name, params)
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
            // console.log(decodedToken)
            const customer_id = decodedToken.payload.customer_id;
            const response = await fetch(`${BaseURL}/customers/${customer_id}/chat_rooms`);
            const responseJson = await response.json();

            if (responseJson && responseJson.data) {
                const responseData: ChatRoomsType = responseJson.data;
                setData(responseData)
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

    const subscribeToPublicChannel = async () => {
        const token = await AsyncStorageHelper.getValue(StorageKeys.customerToken);
        const decodedToken: DecodeResponse | any = await decode(token, "HS256", { skipValidation: true })
        console.log(decodedToken)
        channelSubscribe("PublicChannel", {
            current_user_type: "customer",
            current_user_id: decodedToken.payload.customer_id,
            request_user_type: "employee"
        })
    }

    useEffect(() => {
        fetchChatRoomsByUserIdAndType()
        const unsubscribeFocus = navigation.addListener('focus', () => {
            console.log("Customer focused")
            setTimeout(() => {
                subscribeToPublicChannel()
            }, 5000)
        });
        return () => {
            unsubscribeFocus()
            unsubscribe()
        }
    }, [navigation])

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flex: 1
            }}>
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
                    <Text style={[styles.text, {
                        fontSize: 20,
                        fontWeight: '800'
                    }]}>Chat Rooms</Text>
                    <FlatList data={data}
                        extraData={data}
                        renderItem={({ item }) => renderChatRoomListItems(item)}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        ListEmptyComponent={loading ? <ActivityIndicator /> : <Text style={styles.text}>Chat room not found</Text>} />
                </View>
            </View>
            <View>
                <Button title='Create chat room' onPress={async () => {
                    const token = await AsyncStorageHelper.getValue(StorageKeys.customerToken);
                    const decodedToken: DecodeResponse | any = await decode(token, "HS256", { skipValidation: true })
                    console.log(decodedToken)
                    navigation.navigate("CreateChatRoom", { payload: decodedToken.payload })
                }} />
            </View>
        </SafeAreaView>
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