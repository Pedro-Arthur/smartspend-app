import React, { createContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const setAuthIsLoggedIn = async (value) => {
    await AsyncStorage.setItem('@isLoggedIn', JSON.stringify(value));
    setIsLoggedIn(value);
  };

  const setAuthUser = async (value) => {
    await AsyncStorage.setItem('@user', JSON.stringify(value));
    setUser(value);
  };

  const setAuthToken = async (value) => {
    await AsyncStorage.setItem('@token', value);
    setToken(value);
  };

  const contextValue = useMemo(
    () => ({ isLoggedIn, setAuthIsLoggedIn, user, setAuthUser, token, setAuthToken }),
    [isLoggedIn, setAuthIsLoggedIn, user, setAuthUser, token, setAuthToken]
  );

  const loadStorage = async () => {
    const storageUser = await AsyncStorage.getItem('@user');
    const storageIsLoggedIn = await AsyncStorage.getItem('@isLoggedIn');
    const storageToken = await AsyncStorage.getItem('@token');

    if (storageUser) {
      setUser(JSON.parse(storageUser));
    }

    if (storageIsLoggedIn) {
      setIsLoggedIn(JSON.parse(storageIsLoggedIn));
    }

    if (storageToken) {
      setToken(storageToken);
    }
  };

  useEffect(() => {
    loadStorage();
  }, []);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
