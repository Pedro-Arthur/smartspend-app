import React, { useState } from 'react';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import CurrencyInput from '../components/CurrencyInput';
import DatePickerInput from '../components/DatePickerInput';

const Goals = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');

  const [maxValue, setMaxValue] = useState(0);
  const [date, setDate] = useState(new Date());

  return (
    <Center flex="1" bg={bg}>
      <Heading>GOALS</Heading>
      <Text my={4}>Valor: {maxValue}</Text>
      <CurrencyInput value={maxValue} onChangeText={(v) => setMaxValue(v)} maxDigits={9} />

      <Text my={4}>Data: {date.toLocaleDateString()}</Text>

      <DatePickerInput
        value={date}
        onChange={(v) => setDate(v)}
        maximumDate={new Date(2030, 0, 1)}
        minimumDate={new Date()}
      />
    </Center>
  );
};

export default Goals;
