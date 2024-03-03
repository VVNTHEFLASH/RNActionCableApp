import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChatRoomType, ChatRoomsType } from '../../helper/types'

const CustomerHome = () => {

    const [data, setData] = useState<ChatRoomsType>([])

    const renderChatRoomListItems = (item: ChatRoomType) => {
        return (
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>{item.id} {item.name}</Text>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        setData([
            {
                "id": 1,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:34:25.413Z",
                "updated_at": "2024-03-03T06:34:25.413Z"
            },
            {
                "id": 2,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:52:15.029Z",
                "updated_at": "2024-03-03T06:52:15.029Z"
            },
            {
                "id": 3,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:56:52.626Z",
                "updated_at": "2024-03-03T06:56:52.626Z"
            },
            {
                "id": 4,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:59:52.710Z",
                "updated_at": "2024-03-03T06:59:52.710Z"
            },
            {
                "id": 5,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T07:08:21.649Z",
                "updated_at": "2024-03-03T07:08:21.649Z"
            },
            {
                "id": 1,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:34:25.413Z",
                "updated_at": "2024-03-03T06:34:25.413Z"
            },
            {
                "id": 2,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:52:15.029Z",
                "updated_at": "2024-03-03T06:52:15.029Z"
            },
            {
                "id": 3,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:56:52.626Z",
                "updated_at": "2024-03-03T06:56:52.626Z"
            },
            {
                "id": 4,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:59:52.710Z",
                "updated_at": "2024-03-03T06:59:52.710Z"
            },
            {
                "id": 5,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T07:08:21.649Z",
                "updated_at": "2024-03-03T07:08:21.649Z"
            },
            {
                "id": 1,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:34:25.413Z",
                "updated_at": "2024-03-03T06:34:25.413Z"
            },
            {
                "id": 2,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:52:15.029Z",
                "updated_at": "2024-03-03T06:52:15.029Z"
            },
            {
                "id": 3,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:56:52.626Z",
                "updated_at": "2024-03-03T06:56:52.626Z"
            },
            {
                "id": 4,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T06:59:52.710Z",
                "updated_at": "2024-03-03T06:59:52.710Z"
            },
            {
                "id": 5,
                "name": "employee_2_customer_2",
                "employee_id": 2,
                "customer_id": 2,
                "created_at": "2024-03-03T07:08:21.649Z",
                "updated_at": "2024-03-03T07:08:21.649Z"
            }
        ])
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
                <Text style={styles.text}>Chat Rooms</Text>
                <FlatList data={data} 
                renderItem={({ item }) => renderChatRoomListItems(item)}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}/>
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
        backgroundColor: "#ccc",
        elevation: 4
    }
    
})