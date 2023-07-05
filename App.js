import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Button, Center, NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { preventAutoHideAsync } from 'expo-splash-screen';
import * as LocalAuthentication from 'expo-local-authentication';

import theme from './src/theme';
import colorModeManager from './src/theme/colorModeManager';

import AppLoading from './src/components/AppLoading';
import FetchLoading from './src/components/FetchLoading';

import Routes from './src/routes';

import { ToastProvider } from './src/contexts/ToastContext';
import { FetchLoadingProvider } from './src/contexts/FetchLoadingContext';

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const callPreventAutoHideAsync = async () => {
    await preventAutoHideAsync();
  };

  const handleAuthenticate = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();

    if (available) {
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
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
    return <AppLoading onFinish={handleFinishFontsLoading} />;
  }

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <StatusBar backgroundColor="#5E17EB" barStyle="light-content" />

      {authenticated ? (
        <FetchLoadingProvider>
          <FetchLoading />

          <ToastProvider>
            <Routes />
          </ToastProvider>
        </FetchLoadingProvider>
      ) : (
        <Center safeArea flex={1}>
          <Image
            source={require('./src/assets/images/fingerprint-scan.gif')}
            style={{ width: 200, height: 200 }}
          />
          <Button mt={2} width={200} onPress={handleAuthenticate}>
            Autenticar
          </Button>
        </Center>
      )}
    </NativeBaseProvider>
  );
};
