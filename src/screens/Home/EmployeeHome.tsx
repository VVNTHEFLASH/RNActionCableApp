import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EmployeeHome = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Who logged in</Text>
            <Text>Employee</Text>
        </View>
    )
}

export default EmployeeHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: "#fff"
    }
})