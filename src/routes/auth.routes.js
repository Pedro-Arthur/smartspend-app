import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pages
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import RecoverPassword from '../pages/Auth/RecoverPassword';

const { Navigator, Screen } = createStackNavigator();

const AuthRoutes = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="SignIn"
  >
    <Screen name="SignIn" component={SignIn} />
    <Screen name="SignUp" component={SignUp} />
    <Screen name="RecoverPassword" component={RecoverPassword} />
  </Navigator>
);

export default AuthRoutes;
