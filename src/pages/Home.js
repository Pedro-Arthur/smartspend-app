import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';

const Home = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>HOME</Heading>
    </Center>
  );
};

export default Home;
