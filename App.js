import React, { useCallback, useEffect, useState } from 'react';
import {
  NativeBaseProvider,
  Button,
  Text,
  Alert,
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

const colorModeManager = {
  get: async () => {
    try {
      const val = await AsyncStorage.getItem('@color-mode');
      return val === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem('@color-mode', value);
    } catch (e) {
      console.log(e);
    }
  },
};

function UseColorMode() {
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
}

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const handleFinishLoading = useCallback(() => {
    setFontLoaded(true);
  }, []);

  const checkInternetConnection = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      Alert.alert('Sem conexão com a internet', 'Verifique sua conexão e tente novamente.');
    }
  };

  async function teste() {
    await SplashScreen.preventAutoHideAsync();
  }

  useEffect(() => {
    checkInternetConnection();
    teste();
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
