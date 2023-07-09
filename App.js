import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Button, Center, NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { preventAutoHideAsync } from 'expo-splash-screen';
import * as LocalAuthentication from 'expo-local-authentication';
import 'react-native-gesture-handler';

import theme from './src/theme';
import colorModeManager from './src/theme/colorModeManager';

import AppLoadingFonts from './src/components/AppLoadingFonts';
import FetchLoading from './src/components/FetchLoading';
import Main from './src/components/Main';

import { ToastProvider } from './src/contexts/ToastContext';
import { FetchLoadingProvider } from './src/contexts/FetchLoadingContext';
import { AuthProvider } from './src/contexts/AuthContext';

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const callPreventAutoHideAsync = async () => {
    await preventAutoHideAsync();
  };

  const handleAuthenticate = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();

    if (available) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticação obrigatória',
      });

      if (result.success || result.error === 'not_enrolled') {
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(true);
    }
  };

  const handleFinishFontsLoading = useCallback(() => {
    setFontLoaded(true);
    handleAuthenticate();
  }, []);

  useEffect(() => {
    callPreventAutoHideAsync();
  }, []);

  if (!fontLoaded) {
    return <AppLoadingFonts onFinish={handleFinishFontsLoading} />;
  }

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <StatusBar backgroundColor="#5E17EB" barStyle="light-content" />

      {authenticated ? (
        <FetchLoadingProvider>
          <FetchLoading />

          <ToastProvider>
            <AuthProvider>
              <Main />
            </AuthProvider>
          </ToastProvider>
        </FetchLoadingProvider>
      ) : (
        <Center backgroundColor="white" safeArea flex={1}>
          <Image
            source={require('./src/assets/images/fingerprint-scan.gif')}
            style={styles.image}
          />
          <Button mt={2} width={200} onPress={handleAuthenticate}>
            Autenticar
          </Button>
        </Center>
      )}
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});
