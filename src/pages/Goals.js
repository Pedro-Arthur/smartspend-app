import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';

const Goals = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>GOALS</Heading>
    </Center>
  );
};

export default Goals;
