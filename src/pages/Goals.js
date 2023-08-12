import React, { useState } from 'react';
import { Button, Platform } from 'react-native';
import { useColorModeValue, Heading, Center, Text } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import CurrencyInput from '../components/CurrencyInput';

const Goals = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const themeVariant = useColorModeValue('light', 'dark');

  const [maxValue, setMaxValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      setDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  return (
    <Center flex="1" bg={bg}>
      <Heading>GOALS</Heading>
      <Text my={4}>Valor: {maxValue}</Text>
      <CurrencyInput value={maxValue} onChangeText={(v) => setMaxValue(v)} maxDigits={9} />

      <Text my={4}>Data: {date.toLocaleDateString()}</Text>

      <Button onPress={() => setShowDatePicker(true)} title="Selecione uma data" />
      {showDatePicker && (
        <DateTimePicker
          maximumDate={new Date(2030, 0, 1)}
          minimumDate={new Date()}
          value={date}
          onChange={handleDateChange}
          display="default"
          themeVariant={themeVariant}
          mode="date"
          textColor="#d97706"
        />
      )}
    </Center>
  );
};

export default Goals;
