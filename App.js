import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  NativeBaseProvider,
  Button,
  Text,
  useColorMode,
  useColorModeValue,
  Box,
} from 'native-base';
import * as NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import theme from './src/theme';
import AppLoading from './src/components/AppLoading';

const STORAGE_KEY = '@color-mode';
const DARK_MODE = 'dark';
const LIGHT_MODE = 'light';
const NO_INTERNET_CONNECTION_TITLE = 'Sem conexão com a internet';
const NO_INTERNET_CONNECTION_MESSAGE = 'Verifique sua conexão e tente novamente.';

const colorModeManager = {
  get: async () => {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEY);
      return val === DARK_MODE ? DARK_MODE : LIGHT_MODE;
    } catch (e) {
      return LIGHT_MODE;
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      console.error(e);
    }
  },
};

const UseColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('Light', 'Dark');
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  return (
    <Box flex="1" bg={bg} safeArea>
      <Text fontSize="lg" display="flex" mb={20}>
        The active color mode is{' '}
        <Text bold fontSize="18px">
          {text}
        </Text>
      </Text>
      <Button onPress={toggleColorMode} h={10}>
        Toggle
      </Button>
    </Box>
  );
};

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const handleFinishLoading = useCallback(() => {
    setFontLoaded(true);
  }, []);

  const checkInternetConnection = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      Alert.alert(NO_INTERNET_CONNECTION_TITLE, NO_INTERNET_CONNECTION_MESSAGE);
    }
  };

  const callPreventAutoHideAsync = async () => {
    await SplashScreen.preventAutoHideAsync();
  };

  useEffect(() => {
    checkInternetConnection();
    callPreventAutoHideAsync();
  }, []);

  if (!fontLoaded) {
    return <AppLoading onFinish={handleFinishLoading} />;
  }

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <StatusBar backgroundColor="#5E17EB" barStyle="light-content" />
      <UseColorMode />
    </NativeBaseProvider>
  );
};
