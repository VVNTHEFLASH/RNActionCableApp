// AuthContext.tsx

import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorageHelper, { StorageKeys } from '../helper/utilities';

export type UserType = "EMPLOYEE" | "CUSTOMER" | "USER";

export interface User {
  email: string
  name?: string
  password: string
  type: UserType
}

interface AuthContextType {
  user: User | null;
  signUpByType: (userData: User, props: { navigation: any, route: any }) => Promise<void>
  signInByType: (userData: User, props: { navigation: any, route: any }) => Promise<void>;
  signOut: (props: any) => void;
  loading: boolean
  token: string | null
  loggedInUserType: UserType
  BaseURL: string;
  WSBaseURL: string

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BaseURL = "http://10.0.2.2:3000";
const WSBaseURL = "ws://10.0.2.2:3000";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null);
  const [loggedInUserType, setLoggedInUserType] = useState<"EMPLOYEE" | "CUSTOMER" | "USER">("USER")

  const signInByType = async (userData: User, props: { navigation: any, route: any }) => {
    // Logic for signing in, like API calls or local storage manipulation
    try {
      setLoading(true)
      const loginEndPoint = BaseURL + "/sessions?" + new URLSearchParams({
        email: userData.email,
        password: userData.password,
        type: userData.type.toLowerCase()
      })
      const response = await fetch(loginEndPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const responseJson = await response.json();

      if (responseJson && responseJson.token) {
        setToken(responseJson.token)
        await AsyncStorageHelper.setValue(StorageKeys.loggedInUserType, userData.type)
        if (userData.type === "CUSTOMER") {
          setLoggedInUserType("CUSTOMER")
          await AsyncStorageHelper.setValue(StorageKeys.customerToken, responseJson.token)
          props.navigation.navigate("CustomerRoute")
        }
        else if (userData.type === "EMPLOYEE") {
          setLoggedInUserType("EMPLOYEE")
          await AsyncStorageHelper.setValue(StorageKeys.employeeToken, responseJson.token)
          props.navigation.navigate("EmployeeRoute")
        }
        else {
          setLoggedInUserType("USER")
          props.navigation.navigate("DefaultRoute")
          throw Error("Unexpected type received in user type")
        }
      }
      else {
        Alert.alert("Something went wrong", JSON.stringify(responseJson))
      }

    }
    catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.name, err.message)
      }
      else {
        console.error(JSON.stringify(err))
      }
    }
    finally {
      setLoading(false)
    }
  };

  const signOut = async (props: any) => {
    // Logic for signing out, like clearing local storage
    await AsyncStorageHelper.clearAll();
    props.navigation.navigate("DefaultRoute")
  };

  const signUpByType = async (userData: User, props: { navigation: any, route: any }) => {
    try {
      setLoading(true)
      let type = userData.type.toLowerCase();
      const params = new URLSearchParams({
        [`${type}[email]`]: userData.email,
        [`${type}[name]`]: userData.name as string,
        [`${type}[password]`]: userData.password,
        [`${type}[password_confirmation]`]: userData.password
      });
      const signUpEndpoint = BaseURL + `/${userData.type.toLowerCase()}s?` + params;

      console.log(signUpEndpoint, "Api endpoint")

      const response = await fetch(signUpEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const responseJson = await response.json();

      console.log("===============><==============");
      console.log(responseJson, "Response Json");
      console.log("===============><==============");

      if (responseJson) {
        if (responseJson.email) {
          Alert.alert("Email already exists", "Please try with different email")
        }
        else if (responseJson.name) {
          Alert.alert("Name already exists", "Please try with different name")
        }
        else if (responseJson.password) {
          Alert.alert("Password is empty", "Please enter valid password")
        }
        else if (responseJson.password_confirmation) {
          Alert.alert("Password is empty", "Please enter valid matching password")
        }
        else {
          Alert.alert("Congratulations, Your account was created sucessfully", "Please login to continue", [
            {
              text: "Continue",
              onPress: () => {
                props.navigation.navigate("DefaultRoute", { screen: "Landing" })
              }
            }
          ])
        }
      }
      else {
        Alert.alert("Something went wrong", JSON.stringify(responseJson))
      }
    }
    catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.name, err.message)
      }
      else {
        console.error(JSON.stringify(err))
      }
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signInByType, signOut, signUpByType,
      loading, token, loggedInUserType,
      BaseURL, WSBaseURL
    }}>
      {children}
    </AuthContext.Provider>
  );
};
