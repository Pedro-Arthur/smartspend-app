import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Text, useColorModeValue, Icon } from 'native-base';
import { Platform } from 'react-native';

// Pages
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import BankAccounts from '../pages/BankAccounts';
import BankCards from '../pages/BankCards';
import Goals from '../pages/Goals';

const Tab = createBottomTabNavigator();

const getTabOptions = (text, icon) => ({
  tabBarLabel: ({ color, focused }) => (
    <Text fontSize={10} fontWeight={focused ? 600 : 400} color={color}>
      {text}
    </Text>
  ),
  tabBarIcon: ({ color, focused }) => (
    <Icon as={<AntDesign name={icon} />} color={color} size={focused ? 6 : 5} />
  ),
});

const AppRoutes = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarLabelStyle: {
        fontFamily: 'montserrat-regular',
      },
      tabBarStyle: {
        height: Platform.OS === 'android' ? 60 : 90,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      tabBarItemStyle: {
        paddingVertical: 8,
        backgroundColor: useColorModeValue('#fff', '#111827'),
      },
      tabBarActiveTintColor: '#5E17EB',
      tabBarInactiveTintColor: '#a1a1aa',
    }}
    initialRouteName="Home"
  >
    <Tab.Screen
      name="BankAccounts"
      component={BankAccounts}
      options={getTabOptions('Contas', 'wallet')}
    />
    <Tab.Screen
      name="BankCards"
      component={BankCards}
      options={getTabOptions('Cartões', 'creditcard')}
    />
    <Tab.Screen name="Home" component={Home} options={getTabOptions('Início', 'home')} />
    <Tab.Screen name="Goals" component={Goals} options={getTabOptions('Metas', 'calendar')} />
    <Tab.Screen name="Profile" component={Profile} options={getTabOptions('Perfil', 'user')} />
  </Tab.Navigator>
);

export default AppRoutes;
