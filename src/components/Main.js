import React, { useEffect, useContext } from 'react';
import * as NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Routes from '../routes';
import { ToastContext } from '../contexts/ToastContext';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const Main = () => {
  const { showToast } = useContext(ToastContext);
  const { removeAuthIsLoggedIn } = useContext(AuthContext);

  const checkInternetConnection = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      showToast({
        title: 'Sem conexão com a internet',
        description: 'Verifique sua conexão e tente novamente.',
        variant: 'solid',
        isClosable: true,
        status: 'error',
      });
    }
  };

  useEffect(() => {
    checkInternetConnection();
  }, []);

  // Axios interceptors
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

      throw error;
    }
  );

  api.interceptors.request.use(
    async (request) => {
      const storedToken = await AsyncStorage.getItem('@token');
      if (storedToken) {
        // eslint-disable-next-line no-param-reassign
        request.headers.Authorization = `Bearer ${storedToken}`;
      }
      return request;
    },
    (error) => {
      throw error;
    }
  );

  return <Routes />;
};

export default Main;
