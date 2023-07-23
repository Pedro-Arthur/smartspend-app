import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';

const BankCards = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');

  return (
    <Center flex="1" bg={bg}>
      <Heading>BANK CARDS</Heading>
    </Center>
  );
};

export default BankCards;
