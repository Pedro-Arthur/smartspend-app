import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Text, useColorModeValue, Icon } from 'native-base';
import { Platform } from 'react-native';

// Pages
import Home from '../pages/App/Home';
import Profile from '../pages/App/Profile';
import BankAccounts from '../pages/App/BankAccounts';
import BankCards from '../pages/App/BankCards';
import Goals from '../pages/App/Goals';

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
        backgroundColor: useColorModeValue('#fff', '#27272a'),
      },
      tabBarActiveTintColor: '#d97706',
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
