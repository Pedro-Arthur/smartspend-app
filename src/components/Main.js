import React, { useEffect, useContext } from 'react';
import * as NetInfo from '@react-native-community/netinfo';
import Routes from '../routes';
import { ToastContext } from '../contexts/ToastContext';

const Main = () => {
  const { showToast } = useContext(ToastContext);

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

  return <Routes />;
};

export default Main;
