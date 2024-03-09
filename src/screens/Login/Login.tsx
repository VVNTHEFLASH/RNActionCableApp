import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { UserType, useAuth } from '../../context/AuthContext'
const Login = ({ navigation, route }: any) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signInByType, loading, token } = useAuth();

    const onPressLoginButton = async () => {
        try {
            const type = route.params.type;
            const userData = {
                email,
                password,
                type
            }
            // console.log(userData)
            await signInByType(userData, { navigation, route })
        }
        catch (err) {
            if(err instanceof Error) {
                Alert.alert(err.name, err.message)
            }
            else {
                console.log("Something went wrong", JSON.stringify(err))
            }
        }
        finally {
            setEmail("");
            setPassword("");
        }

    }
    return (
        <View>
            <Text style={{ textAlign: 'center', fontWeight: "800", fontSize: 20 }}>Login</Text>
            <Text>User Type: {route.params.type}</Text>
            <View>
                <View>
                    <Text>Email</Text>
                    <TextInput placeholder='Enter email' value={email} onChangeText={(text) => {
                        setEmail(text)
                    }}/>
                </View>
                <View>
                    <Text>Password</Text>
                    <TextInput placeholder='Enter password' value={password} onChangeText={(text) => {
                        setPassword(text)
                    }} />
                </View>
                <View>
                    <Button title='Login' onPress={onPressLoginButton} />
                </View>
                { loading && <ActivityIndicator />}
                <View>
                    <Text>{token}</Text>
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({})