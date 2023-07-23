import React, { useCallback, useState } from 'react';
import { NativeBaseProvider } from 'native-base';
import 'react-native-gesture-handler';

import theme from './src/theme';
import colorModeManager from './src/theme/colorModeManager';

import AppLoading from './src/components/AppLoading';
import FetchLoading from './src/components/FetchLoading';
import Main from './src/components/Main';
import StatusBar from './src/components/StatusBar';

import { ToastProvider } from './src/contexts/ToastContext';
import { FetchLoadingProvider } from './src/contexts/FetchLoadingContext';
import { AuthProvider } from './src/contexts/AuthContext';

export default () => {
  const [appLoaded, setAppLoaded] = useState(false);

  const handleFinishAppLoading = useCallback(() => {
    setAppLoaded(true);
  }, []);

  if (!appLoaded) {
    return <AppLoading onFinish={handleFinishAppLoading} />;
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
