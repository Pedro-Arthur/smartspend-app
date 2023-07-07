import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return <NavigationContainer>{isLoggedIn ? <AppRoutes /> : <AuthRoutes />}</NavigationContainer>;
};

export default Routes;
