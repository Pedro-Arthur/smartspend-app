import React, { useEffect, useContext } from 'react';
import { useColorModeValue, Spinner, Center } from 'native-base';
import * as NetInfo from '@react-native-community/netinfo';
import { ToastContext } from '../contexts/ToastContext';

const Initial = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
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
        return;
      }

      navigation.navigate('SignIn');
    };

    checkInternetConnection();
  }, []);

  return (
    <Center flex="1" bg={bg} safeArea>
      <Spinner size="lg" />
    </Center>
  );
};

export default Initial;
