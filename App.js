import React, { useEffect, useState } from 'react';
import { Text as RNText } from 'react-native';
import {
  NativeBaseProvider,
  Button,
  Text,
  Alert,
  useColorMode,
  useColorModeValue,
  Box,
} from 'native-base';
import * as Font from 'expo-font';
import * as NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import theme from './src/theme';

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

  const loadFonts = async () => {
    await Font.loadAsync({
      'montserrat-thin': require('./src/assets/fonts/Montserrat-Thin.ttf'),
      'montserrat-thin-italic': require('./src/assets/fonts/Montserrat-ThinItalic.ttf'),

      'montserrat-extra-light': require('./src/assets/fonts/Montserrat-ExtraLight.ttf'),
      'montserrat-extra-light-italic': require('./src/assets/fonts/Montserrat-ExtraLightItalic.ttf'),

      'montserrat-light': require('./src/assets/fonts/Montserrat-Light.ttf'),
      'montserrat-light-italic': require('./src/assets/fonts/Montserrat-LightItalic.ttf'),

      'montserrat-regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
      'montserrat-italic': require('./src/assets/fonts/Montserrat-Italic.ttf'),

      'montserrat-medium': require('./src/assets/fonts/Montserrat-Medium.ttf'),
      'montserrat-medium-italic': require('./src/assets/fonts/Montserrat-MediumItalic.ttf'),

      'montserrat-semi-bold': require('./src/assets/fonts/Montserrat-SemiBold.ttf'),
      'montserrat-semi-bold-italic': require('./src/assets/fonts/Montserrat-SemiBoldItalic.ttf'),

      'montserrat-bold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
      'montserrat-bold-italic': require('./src/assets/fonts/Montserrat-BoldItalic.ttf'),

      'montserrat-extra-bold': require('./src/assets/fonts/Montserrat-ExtraBold.ttf'),
      'montserrat-extra-bold-italic': require('./src/assets/fonts/Montserrat-ExtraBoldItalic.ttf'),

      'montserrat-black': require('./src/assets/fonts/Montserrat-Black.ttf'),
      'montserrat-black-italic': require('./src/assets/fonts/Montserrat-BlackItalic.ttf'),
    });
    setFontLoaded(true);
  };

  const checkInternetConnection = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      Alert.alert('Sem conexão com a internet', 'Verifique sua conexão e tente novamente.');
    }
  };

  useEffect(() => {
    checkInternetConnection();
    loadFonts();
  }, []);

  if (!fontLoaded) {
    return <RNText>Carregando...</RNText>;
  }

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <StatusBar backgroundColor="#5E17EB" barStyle="light-content" />
      <UseColorMode />
    </NativeBaseProvider>
  );
};
