import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorModeValue } from 'native-base';
import { AuthContext } from '../contexts/AuthContext';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer
      theme={{
        dark: useColorModeValue(false, true),
        colors: {
          primary: '#5E17EB',
          background: useColorModeValue('#fafaf9', '#1f2937'),
          text: useColorModeValue('#000', '#fff'),
          card: useColorModeValue('#fafaf9', '#1f2937'),
          border: 'transparent',
        },
      }}
    >
      {isLoggedIn ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
};

export default Routes;
