import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Pages
import Initial from '../pages/Initial';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import RecoverPassword from '../pages/RecoverPassword';
import Home from '../pages/Home';

const { Navigator, Screen } = createStackNavigator();

const Routes = () => (
  <NavigationContainer>
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Initial"
    >
      <Screen name="Initial" component={Initial} />
      <Screen name="SignIn" component={SignIn} />
      <Screen name="SignUp" component={SignUp} />
      <Screen name="RecoverPassword" component={RecoverPassword} />
      <Screen name="Home" component={Home} />
    </Navigator>
  </NavigationContainer>
);

export default Routes;
