// AuthContext.tsx

import React, { createContext, useState, useContext } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (userData: User) => {
    // Logic for signing in, like API calls or local storage manipulation
    setUser(userData);
  };

  const signOut = () => {
    // Logic for signing out, like clearing local storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
