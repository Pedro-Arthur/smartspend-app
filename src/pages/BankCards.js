import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';

const BankCards = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  return (
    <Center flex="1" bg={bg} safeArea>
      <Heading>BANK CARDS</Heading>
    </Center>
  );
};

export default BankCards;
