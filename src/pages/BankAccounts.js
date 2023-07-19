import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';

const BankAccounts = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  return (
    <Center flex="1" bg={bg}>
      <Heading>BANK ACCOUNTS</Heading>
    </Center>
  );
};

export default BankAccounts;
