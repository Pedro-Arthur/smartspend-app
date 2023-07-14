import React, { useContext } from 'react';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { user, isLoggedIn, token } = useContext(AuthContext);

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>PROFILE</Heading>
      <Text>{user.name}</Text>
      <Text>{isLoggedIn}</Text>
      <Text>{token}</Text>
    </Center>
  );
};

export default Profile;
