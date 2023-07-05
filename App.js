import React, { useCallback, useEffect, useState } from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { preventAutoHideAsync } from 'expo-splash-screen';

import theme from './src/theme';
import colorModeManager from './src/theme/colorModeManager';

import AppLoading from './src/components/AppLoading';
import FetchLoading from './src/components/FetchLoading';

import Routes from './src/routes';

import { ToastProvider } from './src/contexts/ToastContext';
import { FetchLoadingProvider } from './src/contexts/FetchLoadingContext';

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const handleFinishFontsLoading = useCallback(() => {
    setFontLoaded(true);
  }, []);

  useEffect(() => {
    const callPreventAutoHideAsync = async () => {
      await preventAutoHideAsync();
    };

    callPreventAutoHideAsync();
  }, []);

  if (!fontLoaded) {
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
