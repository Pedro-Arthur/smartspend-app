import React from 'react';
import { useColorModeValue, Heading, Center, Button, Switch } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  const logout = async () => {
    await AsyncStorage.removeItem('@user');

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      })
    );
  };

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>HOME</Heading>
      <Switch mt={5} size="lg" />
      <Button mt={5} onPress={logout} w={40} backgroundColor="red.500">
        Sair
      </Button>
    </Center>
  );
};

export default Home;
