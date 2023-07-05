import React, { useCallback, useEffect, useState } from 'react';
import { NativeBaseProvider } from 'native-base';
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

  const callPreventAutoHideAsync = async () => {
    await preventAutoHideAsync();
  };

  const handleFinishFontsLoading = useCallback(() => {
    setFontLoaded(true);
  }, []);

  useEffect(() => {
    callPreventAutoHideAsync();
    handleAuthenticate();
  }, []);

  if (!fontLoaded || !authenticated) {
    return <AppLoading onFinish={handleFinishFontsLoading} />;
  }

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <StatusBar backgroundColor="#5E17EB" barStyle="light-content" />

      <FetchLoadingProvider>
        <FetchLoading />

        <ToastProvider>
          <Routes />
        </ToastProvider>
      </FetchLoadingProvider>
    </NativeBaseProvider>
  );
};
