import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorageHelper, { StorageKeys } from '../../helper/utilities'

const Splash = ({ navigation, route }: any) => {

  const getSessionDetails = async () => {
    try {
      const userType = await AsyncStorageHelper.getValue(StorageKeys.loggedInUserType)
      if (userType === 'EMPLOYEE') {
        navigation.navigate("EmployeeRoute")
      } else if (userType === "CUSTOMER") {
        navigation.navigate("CustomerRoute")
      } else {
        setTimeout(() => {
          navigation.navigate("Landing")
        }, 3000)
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
    }
  }

  useEffect(() => {
    getSessionDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Splash</Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  }
})