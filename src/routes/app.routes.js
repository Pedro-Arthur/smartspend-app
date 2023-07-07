import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

// Pages
import Home from '../pages/Home';
import Profile from '../pages/Profile';

const Tab = createBottomTabNavigator();

const homeScreenOptions = {
  tabBarLabel: 'Início',
  tabBarIcon: ({ color, size }) => <AntDesign name="home" color={color} size={size} />,
};

const profileScreenOptions = {
  tabBarLabel: 'Perfil',
  tabBarIcon: ({ color, size }) => <AntDesign name="user" color={color} size={size} />,
};

const AppRoutes = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarLabelStyle: {
        fontFamily: 'montserrat-regular',
      },
      tabBarStyle: {
        height: 60,
      },
      tabBarItemStyle: {
        paddingVertical: 8,
      },
    }}
    initialRouteName="Home"
  >
    <Tab.Screen name="Home" component={Home} options={homeScreenOptions} />

    <Tab.Screen name="Profile" component={Profile} options={profileScreenOptions} />
  </Tab.Navigator>
);

export default AppRoutes;
