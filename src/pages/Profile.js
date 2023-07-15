import React, { useContext } from 'react';
import { useColorModeValue, Heading, Center, Text, Button } from 'native-base';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { user, token } = useContext(AuthContext);

  const changeName = async () => {
    await api.patch(`/users/${user.id}`, { name: `joao${user.id}` });
  };

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>PROFILE</Heading>
      <Text>name: {user.name}</Text>
      <Text>final 4 chars token: {token.substring(token.length - 4)}</Text>

      <Button onPress={() => changeName()}>change name</Button>
    </Center>
  );
};

export default Profile;
