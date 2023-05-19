import React, { useEffect, useState } from 'react';
import { Text as RNText } from 'react-native';
import {
  NativeBaseProvider,
  extendTheme,
  Button,
  Text,
  Alert,
  useColorMode,
  useColorModeValue,
  Center,
  Box,
} from 'native-base';
import * as Font from 'expo-font';
import * as NetInfo from '@react-native-community/netinfo';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#F5F0FB',
      100: '#EADBFF',
      200: '#E5D0FE',
      300: '#C9A1FD',
      400: '#A872F9',
      500: '#8B4EF3',
      600: '#5E17EB',
      700: '#4810CA',
      800: '#350BA9',
      900: '#250788',
    },
  },

  fontConfig: {
    Montserrat: {
      100: {
        normal: 'montserrat-thin',
        italic: 'montserrat-thin-italic',
      },
      200: {
        normal: 'montserrat-extra-light',
        italic: 'montserrat-extra-light-italic',
      },
      300: {
        normal: 'montserrat-light',
        italic: 'montserrat-light-italic',
      },
      400: {
        normal: 'montserrat-regular',
        italic: 'montserrat-italic',
      },
      500: {
        normal: 'montserrat-medium',
        italic: 'montserrat-medium-italic',
      },
      600: {
        normal: 'montserrat-semi-bold',
        italic: 'montserrat-semi-bold-italic',
      },
      700: {
        normal: 'montserrat-bold',
        italic: 'montserrat-bold-italic',
      },
      800: {
        normal: 'montserrat-extra-bold',
        italic: 'montserrat-extra-bold-italic',
      },
      900: {
        normal: 'montserrat-black',
        italic: 'montserrat-black-italic',
      },
    },
  },

  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Montserrat',
  },
});

function UseColorMode() {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('Light', 'Dark');
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  return (
    <Center>
      <Box p="4" flex="1" bg={bg} maxW="300" w="100%" mt={10} safeArea>
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
    </Center>
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
    <NativeBaseProvider theme={theme}>
      <Center flex={1} px="3">
        <UseColorMode />
      </Center>
    </NativeBaseProvider>
  );
};
