import React, { useState } from 'react';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import CurrencyInput from '../components/CurrencyInput';

const Goals = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');

  const [maxValue, setMaxValue] = useState(0);

  return (
    <Center flex="1" bg={bg}>
      <Heading>GOALS</Heading>
      <Text my={4}>Valor: {maxValue}</Text>
      <CurrencyInput onChangeText={(v) => setMaxValue(v)} maxValue={50000000} />
    </Center>
  );
};

export default Goals;
