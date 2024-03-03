// AuthContext.tsx

import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorageHelper, { StorageKeys } from '../helper/utilities';

interface User {
  email: string
  name?: string
  password: string
  type: "EMPLOYEE" | "CUSTOMER"
}

interface AuthContextType {
  user: User | null;
  signInByType: (userData: User, props: { navigation: any, route: any}) => Promise<void>;
  signOut: () => void;
  loading: boolean
  token: string | null
  loggedInUserType: "EMPLOYEE" | "CUSTOMER" | "USER"
  BaseURL: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BaseURL = "http://10.0.2.2:3000";

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
  const signInByType = async (userData: User, props: { navigation: any, route: any}) => {
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

      if(responseJson && responseJson.token) {
        setToken(responseJson.token)
        await AsyncStorageHelper.setValue(StorageKeys.loggedInUserType, userData.type)
        if(userData.type === "CUSTOMER") {
          setLoggedInUserType("CUSTOMER")
          await AsyncStorageHelper.setValue(StorageKeys.customerToken, responseJson.token)
          props.navigation.navigate("CustomerRoute")
        }
        else if(userData.type === "EMPLOYEE") {
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
      if(err instanceof Error) {
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

  const signOut = () => {
    // Logic for signing out, like clearing local storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signInByType, signOut, loading, token, loggedInUserType, BaseURL }}>
      {children}
    </AuthContext.Provider>
  );
};
