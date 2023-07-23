import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';

const Goals = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');

  return (
    <Center flex="1" bg={bg}>
      <Heading>GOALS</Heading>
    </Center>
  );
};

export default Goals;
