import React, { useContext } from 'react';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import { DataContext } from '../contexts/DataContext';

const BankAccounts = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const { banks } = useContext(DataContext);

  return (
    <Center flex="1" bg={bg}>
      <Heading>BANK ACCOUNTS</Heading>
      <Text>Bancos: {banks.length}</Text>
    </Center>
  );
};

export default BankAccounts;
