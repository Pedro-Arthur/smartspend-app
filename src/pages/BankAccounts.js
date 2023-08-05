import React, { useContext } from 'react';
import { useColorModeValue, Center, Text, Box, FlatList, VStack } from 'native-base';
import { DataContext } from '../contexts/DataContext';

const BankAccounts = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');

  const { banks, bankAccounts } = useContext(DataContext);

  return (
    <Box flex="1" bg={bg}>
      <Center my="4">
        <Text>CONTAS</Text>
      </Center>

      <FlatList
        data={bankAccounts}
        renderItem={({ item }) => (
          <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor}>
            <VStack>
              <Text>ID: {item.id}</Text>
              <Text>NUMERO: {item.number}</Text>
              <Text>DIGITO: {item.digit}</Text>
              <Text>AGENCIA: {item.agency}</Text>
              <Text>BANCO: {item.bank.name}</Text>
            </VStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};

export default BankAccounts;
