import React, { useEffect, useContext } from 'react';
import * as NetInfo from '@react-native-community/netinfo';
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

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
        await removeAuthIsLoggedIn();
      }

      throw error;
    }
  );

  return <Routes />;
};

export default Main;
