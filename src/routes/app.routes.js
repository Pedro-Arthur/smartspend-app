import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorModeValue, Icon, Center, Avatar } from 'native-base';
import { Platform } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

// Pages
import Home from '../pages/App/Home';
import Profile from '../pages/App/Profile';
import BankAccounts from '../pages/App/BankAccounts';
import BankCards from '../pages/App/BankCards';
import Goals from '../pages/App/Goals';

const Tab = createBottomTabNavigator();

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  const homeIcon = () => (
    <Center bg="primary.600" borderRadius="full" w={12} h={12} mt="-7" shadow={2}>
      <Icon as={<AntDesign name="home" />} size={6} color="white" />
    </Center>
  );

  const bankCardsIcon = ({ color, focused }) => (
    <Icon as={<Ionicons name={focused ? 'card-sharp' : 'card-outline'} />} color={color} size={6} />
  );

  const bankAccountsIcon = ({ color, focused }) => (
    <Icon
      as={<MaterialCommunityIcons name={focused ? 'bank' : 'bank-outline'} />}
      color={color}
      size={6}
    />
  );

  const goalsIcon = ({ color, focused }) => (
    <Icon
      as={<Ionicons name={focused ? 'ios-calendar' : 'ios-calendar-outline'} />}
      color={color}
      size={6}
    />
  );

  const profileIcon = () =>
    user.pictureUrl ? (
      <Avatar
        size="27px"
        source={{
          uri: user.pictureUrl,
        }}
      />
    ) : (
      <Avatar size="27px" bg="primary.600" _text={{ color: 'white', fontSize: 11 }}>
        {user.name.charAt(0)}
      </Avatar>
    );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'montserrat-regular',
        },
        tabBarStyle: {
          height: Platform.OS === 'android' ? 45 : 75,
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
        options={{
          tabBarLabel: () => null,
          tabBarIcon: bankAccountsIcon,
        }}
      />

      <Tab.Screen
        name="BankCards"
        component={BankCards}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: bankCardsIcon,
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: homeIcon,
        }}
      />

      <Tab.Screen
        name="Goals"
        component={Goals}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: goalsIcon,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: profileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppRoutes;
