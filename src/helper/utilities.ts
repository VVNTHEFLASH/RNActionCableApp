import AsyncStorage from "@react-native-async-storage/async-storage";

type UserType = "CUSTOMER" | "EMPLOYEE" | "USER_TYPE"
interface storageKeysProps { 
    [key: string]: any
    loggedInUserType: UserType
    customerToken: string
    employeeToken: string
}
export const StorageKeys: storageKeysProps = {
    customerToken: "CUSTOMER_TOKEN",
    employeeToken: "EMPLOYEE_TOKEN",
    loggedInUserType: "USER_TYPE"
}

// AsyncStorage helper functions
export const AsyncStorageHelper = {
    // Get value from AsyncStorage
    getValue: async (key: string) => {
      try {
        const value = await AsyncStorage.getItem(key);
        return value !== null ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        return null;
      }
    },
  
    // Set value in AsyncStorage
    setValue: async (key: string, value: any) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    },
  
    // Remove value from AsyncStorage
    removeValue: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing data from AsyncStorage:', error);
      }
    },
  
    // Clear all AsyncStorage data
    clearAll: async () => {
      try {
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    },
  };
  
  export default AsyncStorageHelper;