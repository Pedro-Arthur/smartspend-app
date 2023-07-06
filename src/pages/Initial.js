import React, { useEffect, useContext } from 'react';
import { useColorModeValue, Spinner, Center } from 'native-base';
import * as NetInfo from '@react-native-community/netinfo';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastContext } from '../contexts/ToastContext';

const Initial = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
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

  const handleRouteRedirection = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));

    if (user) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        })
      );
    }
  };

  useEffect(() => {
    checkInternetConnection();
    handleRouteRedirection();
  }, []);

  return (
    <Center flex="1" bg={bg} safeArea>
      <Spinner size="lg" />
    </Center>
  );
};

export default Initial;
