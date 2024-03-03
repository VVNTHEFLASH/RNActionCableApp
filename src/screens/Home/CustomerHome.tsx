import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChatRoomType, ChatRoomsType } from '../../helper/types'
import { useAuth } from '../../context/AuthContext'
import AsyncStorageHelper, { StorageKeys } from '../../helper/utilities';
import { DecodeResponse, decode } from "react-native-pure-jwt";

const CustomerHome = () => {
    const { BaseURL } = useAuth()
    const [data, setData] = useState<ChatRoomsType>([])
    const [loading, setLoading] = useState(false)
    const renderChatRoomListItems = (item: ChatRoomType) => {
        return (
            <TouchableOpacity style={styles.button} onPress={() => {
                console.log(item.id);
                
            }}>
                <Text style={styles.text}>{item.id} {item.name}</Text>
            </TouchableOpacity>
        )
    }

    const fetchChatRoomsByUserIdAndType = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorageHelper.getValue(StorageKeys.customerToken);
            const decodedToken: DecodeResponse | any = await decode(token, "HS256", { skipValidation: true })
            console.log(decodedToken)
            const customer_id  = decodedToken.payload.customer_id;
            const response = await fetch(`${BaseURL}/employees/${customer_id}/chat_rooms`);
            const responseJson = await response.json();

            if(responseJson) {
                setData(responseJson)
            }
            else {
                Alert.alert("Something went wrong", JSON.stringify(responseJson))
            }
        } catch (error) {
            if(error instanceof Error) {
                Alert.alert(error.name, error.message)
            }
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchChatRoomsByUserIdAndType()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{
                flex: 0.1,
            }}>
                <Text style={styles.text}>Who logged in</Text>
                <Text style={styles.text}>Customer</Text>
            </View>
            <View style={{
                flex: 0.9,
            }}>
                <Text style={[styles.text, { }]}>Chat Rooms</Text>
                <FlatList data={data} 
                renderItem={({ item }) => renderChatRoomListItems(item)}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={loading ? <ActivityIndicator /> : <Text>Chat room not found</Text>}/>
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