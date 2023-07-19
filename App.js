import React, { useCallback, useEffect, useState } from 'react';
import { NativeBaseProvider } from 'native-base';
import { preventAutoHideAsync } from 'expo-splash-screen';
import 'react-native-gesture-handler';

import theme from './src/theme';
import colorModeManager from './src/theme/colorModeManager';

import AppLoadingFonts from './src/components/AppLoadingFonts';
import FetchLoading from './src/components/FetchLoading';
import Main from './src/components/Main';
import StatusBar from './src/components/StatusBar';

import { ToastProvider } from './src/contexts/ToastContext';
import { FetchLoadingProvider } from './src/contexts/FetchLoadingContext';
import { AuthProvider } from './src/contexts/AuthContext';

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const callPreventAutoHideAsync = async () => {
    await preventAutoHideAsync();
  };

  const handleFinishFontsLoading = useCallback(() => {
    setFontLoaded(true);
  }, []);

  useEffect(() => {
    callPreventAutoHideAsync();
  }, []);

  if (!fontLoaded) {
    return <AppLoadingFonts onFinish={handleFinishFontsLoading} />;
  }

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <StatusBar />

      <FetchLoadingProvider>
        <FetchLoading />

        <ToastProvider>
          <AuthProvider>
            <Main />
          </AuthProvider>
        </ToastProvider>
      </FetchLoadingProvider>
    </NativeBaseProvider>
  );
};
