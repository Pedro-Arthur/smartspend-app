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
          primary: '#d97706',
          background: useColorModeValue('#f5f5f4', '#18181b'),
          text: useColorModeValue('#000', '#fff'),
          card: useColorModeValue('#f5f5f4', '#18181b'),
          border: 'transparent',
        },
      }}
    >
      {isLoggedIn ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
};

export default Routes;
