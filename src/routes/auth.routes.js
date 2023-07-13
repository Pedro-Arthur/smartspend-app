import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pages
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import RecoverPasswordSendCode from '../pages/Auth/RecoverPasswordSendCode';
import RecoverPasswordCheckCode from '../pages/Auth/RecoverPasswordCheckCode';
import RecoverPasswordUpdate from '../pages/Auth/RecoverPasswordUpdate';

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
    <Screen name="RecoverPasswordSendCode" component={RecoverPasswordSendCode} />
    <Screen name="RecoverPasswordCheckCode" component={RecoverPasswordCheckCode} />
    <Screen name="RecoverPasswordUpdate" component={RecoverPasswordUpdate} />
  </Navigator>
);

export default AuthRoutes;
