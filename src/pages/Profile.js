import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';

const Profile = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>PROFILE</Heading>
    </Center>
  );
};

export default Profile;
