import React, { useContext } from 'react';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { user, token } = useContext(AuthContext);

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>PROFILE</Heading>
      <Text>name: {user.name}</Text>
      <Text>final 4 chars token: {token.substring(token.length - 4)}</Text>
    </Center>
  );
};

export default Profile;
