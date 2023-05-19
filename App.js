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
      50: '#f5f0fb',
      100: '#eadbff',
      200: '#dac0ff',
      300: '#c39eff',
      400: '#aa7dff',
      500: '#5E17EB',
      600: '#822be6',
      700: '#6b24bf',
      800: '#541d99',
      900: '#431774',
    },
  },

  fontConfig: {
    Montserrat: {
      400: {
        normal: 'montserrat-regular',
        italic: 'montserrat-italic',
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
      'montserrat-regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
      'montserrat-italic': require('./src/assets/fonts/Montserrat-Italic.ttf'),
      'montserrat-bold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
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
