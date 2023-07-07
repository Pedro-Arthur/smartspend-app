import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pages
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import RecoverPassword from '../pages/RecoverPassword';

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
