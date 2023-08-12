import React, { useState, useRef } from 'react';
import { Platform } from 'react-native';
import { useColorModeValue, Input, Icon } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';

const DatePickerInput = ({ value, onChange, maximumDate, minimumDate }) => {
  const themeVariant = useColorModeValue('light', 'dark');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const inputRef = useRef(null);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      onChange(selectedDate);
    }
    setShowDatePicker(Platform.OS === 'ios');
    inputRef.current.blur();
  };

  return (
    <>
      <Input
        ref={inputRef}
        InputLeftElement={
          <Icon as={<AntDesign name="calendar" />} size={4} ml="3" color="muted.400" />
        }
        onFocus={() => setShowDatePicker(true)}
        value={value.toLocaleDateString()}
        showSoftInputOnFocus={false}
      />

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
