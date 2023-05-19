import React, { useEffect, useState } from 'react';
import { Text as RNText } from 'react-native';
import {
  NativeBaseProvider,
  extendTheme,
  WarningOutlineIcon,
  Button,
  Text,
  Alert,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const App = () => {
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
      <SafeAreaView>
        <WarningOutlineIcon />

        <Button size="sm" variant="solid">
          PRIMARY
        </Button>
        <Button size="sm" variant="subtle" colorScheme="secondary">
          SECONDARY
        </Button>
        <Button size="sm" variant="subtle" isDisabled>
          DISABLED
        </Button>

        <Text fontSize="xs">xs</Text>
        <Text fontSize="sm">sm</Text>
        <Text fontSize="md">md</Text>
        <Text fontSize="lg">lg</Text>
        <Text fontSize="xl">xl</Text>
        <Text fontSize="2xl">2xl</Text>
        <Text fontSize="3xl">3xl</Text>
        <Text fontSize="4xl">4xl</Text>
        <Text fontSize="5xl">5xl</Text>
        <Text fontSize="6xl">6xl</Text>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default App;
