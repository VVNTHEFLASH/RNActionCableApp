import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/AuthContext'
const Login = ({ navigation, route }: any) => {
    const { signInByType } = useAuth()
    return (
        <View>
            <Text style={{ textAlign: 'center', fontWeight: "800", fontSize: 20 }}>Login</Text>
            <Text>User Type: {route.params.type}</Text>
            <View>
                <View>
                    <Text>Email</Text>
                    <TextInput placeholder='Enter email' />
                </View>
                <View>
                    <Text>Password</Text>
                    <TextInput placeholder='Enter password' />
                </View>
                <View>
                    <Button title='Login' onPress={() => {
                        signInByType(route.params.type)
                    }} />
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({})