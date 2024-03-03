import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Landing = ({ navigation }: any) => {

    const onPressLoginByType = (type: "CUSTOMER" | "EMPLOYEE") => {
        navigation.navigate("Login", { type })
    }

    const onPressSignUpByType = (type: "CUSTOMER" | "EMPLOYEE") => {
        navigation.navigate("Signup", { type })
    }
    return (
        <View style={{
            flex: 1,
            justifyContent :'space-evenly'
        }}>
            <Button title="Customer login" color={"gold"} onPress={() => onPressLoginByType("CUSTOMER")}></Button>
            <Button title="Customer signup" onPress={() => onPressSignUpByType("CUSTOMER")}></Button>
            <Button title="Employee login"  color={"gold"} onPress={() => onPressLoginByType("EMPLOYEE")}></Button>
            <Button title="Employee signup"  onPress={() => onPressSignUpByType("EMPLOYEE")}></Button>
        </View>
    )
}

export default Landing

const styles = StyleSheet.create({})