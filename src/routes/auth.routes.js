import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';

// Pages
import Welcome from '../pages/Auth/Welcome';
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import RecoverPasswordSendCode from '../pages/Auth/RecoverPasswordSendCode';
import RecoverPasswordCheckCode from '../pages/Auth/RecoverPasswordCheckCode';
import RecoverPasswordUpdate from '../pages/Auth/RecoverPasswordUpdate';

const { Navigator, Screen } = createStackNavigator();

const AuthRoutes = () => {
  const { hasFirstAccess } = useContext(AuthContext);

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={hasFirstAccess ? 'SignIn' : 'Welcome'}
    >
      <Screen name="Welcome" component={Welcome} />
      <Screen name="SignIn" component={SignIn} />
      <Screen name="SignUp" component={SignUp} />
      <Screen name="RecoverPasswordSendCode" component={RecoverPasswordSendCode} />
      <Screen name="RecoverPasswordCheckCode" component={RecoverPasswordCheckCode} />
      <Screen name="RecoverPasswordUpdate" component={RecoverPasswordUpdate} />
    </Navigator>
  );
};

export default AuthRoutes;
