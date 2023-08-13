import React, { useState } from 'react';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import CurrencyInput from '../components/CurrencyInput';
import DatePickerInput from '../components/DatePickerInput';
import { formatDate } from '../utils/helpers';

const Goals = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');

  const todayDate = formatDate(new Date());
  const maximumDate = formatDate(new Date(2030, 0, 1));

  const [maxValue, setMaxValue] = useState(0);
  const [date, setDate] = useState();
  const [date2, setDate2] = useState();

  return (
    <Center flex="1" bg={bg}>
      <Heading>GOALS</Heading>
      <Text my={4}>Valor: {maxValue}</Text>
      <CurrencyInput value={maxValue} onChangeText={(v) => setMaxValue(v)} maxDigits={9} />

      <DatePickerInput
        value={date}
        onChange={(v) => setDate(v)}
        maximumDate={maximumDate}
        minimumDate={todayDate}
        current={todayDate}
        placeholder="Data 1"
      />

      <DatePickerInput
        value={date2}
        onChange={(v) => setDate2(v)}
        maximumDate={maximumDate}
        minimumDate={todayDate}
        current={todayDate}
        placeholder="Data 2"
      />
    </Center>
  );
};

export default Goals;
