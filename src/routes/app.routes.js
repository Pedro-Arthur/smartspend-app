import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Text } from 'native-base';

// Pages
import Home from '../pages/Home';
import Profile from '../pages/Profile';

const Tab = createBottomTabNavigator();

const homeScreenOptions = {
  tabBarLabel: ({ color, focused }) => (
    <Text fontSize={10} fontWeight={focused ? 600 : 400} color={color}>
      Início
    </Text>
  ),
  tabBarIcon: ({ color, focused }) => (
    <AntDesign name="home" color={color} size={focused ? 25 : 20} />
  ),
};

const profileScreenOptions = {
  tabBarLabel: ({ color, focused }) => (
    <Text fontSize={10} fontWeight={focused ? 600 : 400} color={color}>
      Perfil
    </Text>
  ),
  tabBarIcon: ({ color, focused }) => (
    <AntDesign name="user" color={color} size={focused ? 25 : 20} />
  ),
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
        backgroundColor: '#5E17EB',
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#a1a1aa',
    }}
    initialRouteName="Home"
  >
    <Tab.Screen name="Home" component={Home} options={homeScreenOptions} />

    <Tab.Screen name="Profile" component={Profile} options={profileScreenOptions} />
  </Tab.Navigator>
);

export default AppRoutes;
