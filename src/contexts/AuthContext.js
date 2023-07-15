import React, { createContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorModeValue, Spinner, Center } from 'native-base';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
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

  const removeAuthIsLoggedIn = async () => {
    await AsyncStorage.removeItem('@isLoggedIn');
    setIsLoggedIn(false);
  };

  const removeAuthUser = async () => {
    await AsyncStorage.removeItem('@user');
    setUser(null);
  };

  const removeAuthToken = async () => {
    await AsyncStorage.removeItem('@token');
    setToken(null);
  };

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      setAuthIsLoggedIn,
      removeAuthIsLoggedIn,
      user,
      setAuthUser,
      removeAuthUser,
      token,
      setAuthToken,
      removeAuthToken,
    }),
    [
      isLoggedIn,
      setAuthIsLoggedIn,
      removeAuthIsLoggedIn,
      user,
      setAuthUser,
      removeAuthUser,
      token,
      setAuthToken,
      removeAuthToken,
    ]
  );

  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  const loadStorage = async () => {
    const [storageUser, storageIsLoggedIn, storageToken] = await Promise.all([
      AsyncStorage.getItem('@user'),
      AsyncStorage.getItem('@isLoggedIn'),
      AsyncStorage.getItem('@token'),
    ]);

    const parsedUser = storageUser ? JSON.parse(storageUser) : null;
    const currentTime = Date.now() / 1000;

    if (parsedUser) {
      if (currentTime > parsedUser.exp) {
        await removeAuthIsLoggedIn();
      } else {
        setUser(parsedUser);
      }
    }

    if (storageIsLoggedIn && parsedUser && currentTime <= parsedUser.exp) {
      setIsLoggedIn(JSON.parse(storageIsLoggedIn));
    }

    if (storageToken) {
      setToken(storageToken);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  if (isLoading) {
    return (
      <Center flex="1" bg={bg} safeArea>
        <Spinner size="lg" />
      </Center>
    );
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
