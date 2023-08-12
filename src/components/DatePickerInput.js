import React, { useState } from 'react';
import { Button, Platform } from 'react-native';
import { useColorModeValue } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerInput = ({ value, onChange, maximumDate, minimumDate }) => {
  const themeVariant = useColorModeValue('light', 'dark');

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      onChange(selectedDate);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  return (
    <>
      <Button onPress={() => setShowDatePicker(true)} title="Selecione uma data" />

      {showDatePicker && (
        <DateTimePicker
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          value={value}
          onChange={handleDateChange}
          display="default"
          themeVariant={themeVariant}
          mode="date"
          textColor="#d97706"
        />
      )}
    </>
  );
};

export default DatePickerInput;
