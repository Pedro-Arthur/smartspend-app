import React, { useState } from 'react';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import CurrencyInput from '../components/CurrencyInput';

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
      <DateTimePicker
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date()}
        value={date}
        onChange={(v) => console.log(v)}
        display="default"
        themeVariant={useColorModeValue('light', 'dark')}
        mode="date"
        textColor="#d97706"
      />
    </Center>
  );
};

export default Goals;
