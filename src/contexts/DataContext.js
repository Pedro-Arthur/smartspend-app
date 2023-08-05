import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorModeValue, Spinner, Center } from 'native-base';
import { ToastContext } from './ToastContext';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { showToast } = useContext(ToastContext);
  const { removeAuthIsLoggedIn } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState([]);

  const contextValue = useMemo(
    () => ({
      banks,
    }),
    [banks]
  );

  const bg = useColorModeValue('warmGray.100', 'dark.50');

  const loadAuthenticatedData = async (token) => {
    try {
      const [banksRes] = await Promise.all([
        api.get('/banks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setBanks(banksRes);
    } catch (error) {
      showToast({
        title: 'Ops!',
        description: error?.response?.data?.message || 'Erro ao carregar dados!',
        variant: 'solid',
        isClosable: true,
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadData = async () => {
    const [storageIsLoggedIn, storageToken] = await Promise.all([
      AsyncStorage.getItem('@isLoggedIn'),
      AsyncStorage.getItem('@token'),
    ]);

    if (storageIsLoggedIn) loadAuthenticatedData(storageToken);
    else setIsLoading(false);
  };

  useEffect(() => {
    handleLoadData();
  }, []);

  // Axios response interceptor
  api.interceptors.response.use(
    (response) => {
      if (response && response.data && typeof response.data === 'object') {
        return response.data;
      }
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
        await removeAuthIsLoggedIn();
      }
      return Promise.reject(error);
    }
  );

  if (isLoading) {
    return (
      <Center flex="1" bg={bg}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
