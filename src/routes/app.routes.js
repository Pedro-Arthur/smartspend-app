import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Pages
import Home from '../pages/Home';
import Profile from '../pages/Profile';

const Tab = createBottomTabNavigator();

const AppRoutes = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Home"
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);

export default AppRoutes;
