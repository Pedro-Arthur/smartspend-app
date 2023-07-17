import React, { useContext } from 'react';
import {
  useColorModeValue,
  Heading,
  Center,
  Text,
  Button,
  useColorMode,
  Switch,
  HStack,
} from 'native-base';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { user, token } = useContext(AuthContext);
  const { removeAuthIsLoggedIn, removeAuthUser, removeAuthToken } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();

  const changeName = async () => {
    await api.patch(
      `/users/${user.id}`,
      { name: `joao${user.id}` },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const logout = async (force) => {
    if (force) {
      await Promise.all([removeAuthIsLoggedIn(), removeAuthUser(), removeAuthToken()]);
    } else {
      await removeAuthIsLoggedIn();
    }
  };

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>PROFILE</Heading>
      <Text>name: {user.name}</Text>
      <Text>final 4 chars token: {token.substring(token.length - 4)}</Text>

      <Text my={5}>Tema atual: {colorMode}</Text>

      <HStack flexShrink={1} alignItems="center">
        <Text>Modo escuro:</Text>
        <Switch isChecked={colorMode === 'dark'} onToggle={toggleColorMode} mt={5} size="lg" />
      </HStack>

      <Button onPress={() => changeName()}>change name</Button>

      <Button mt={5} onPress={() => logout(true)} w={40} backgroundColor="red.500">
        force logout
      </Button>
    </Center>
  );
};

export default Profile;
